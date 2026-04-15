package razorpay

import (
	"bytes"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strconv"
	"strings"
	"time"
)

type OrderResponse struct {
	ID     string `json:"id"`
	Amount int64  `json:"amount"`
	Status string `json:"status"`
}

type createOrderPayload struct {
	Amount   int64  `json:"amount"`
	Currency string `json:"currency"`
	Receipt  string `json:"receipt"`
}

// CreateOrder creates a Razorpay order (amount in paise).
func CreateOrder(keyID, keySecret string, amountPaise int64, receipt string) (*OrderResponse, error) {
	body, _ := json.Marshal(createOrderPayload{
		Amount:   amountPaise,
		Currency: "INR",
		Receipt:  receipt,
	})
	req, err := http.NewRequest(http.MethodPost, "https://api.razorpay.com/v1/orders", bytes.NewReader(body))
	if err != nil {
		return nil, err
	}
	req.SetBasicAuth(keyID, keySecret)
	req.Header.Set("Content-Type", "application/json")
	client := &http.Client{Timeout: 15 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	raw, _ := io.ReadAll(resp.Body)
	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return nil, fmt.Errorf("razorpay: %s: %s", resp.Status, string(raw))
	}
	var out OrderResponse
	if err := json.Unmarshal(raw, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

// VerifySignature validates payment signature from Razorpay checkout.
func VerifySignature(orderID, paymentID, signature, keySecret string) bool {
	payload := orderID + "|" + paymentID
	mac := hmac.New(sha256.New, []byte(keySecret))
	mac.Write([]byte(payload))
	expected := hex.EncodeToString(mac.Sum(nil))
	sig := strings.TrimSpace(strings.ToLower(signature))
	exp := strings.ToLower(expected)
	return len(sig) == len(exp) && hmac.Equal([]byte(sig), []byte(exp))
}

// INRToPaise converts rupees string like "250000" or "2,50,000" to paise.
func INRToPaise(rupeesStr string) (int64, error) {
	s := strings.TrimSpace(rupeesStr)
	s = strings.ReplaceAll(s, ",", "")
	s = strings.ReplaceAll(s, "₹", "")
	s = strings.TrimSpace(s)
	f, err := strconv.ParseFloat(s, 64)
	if err != nil {
		return 0, err
	}
	return int64(f * 100), nil
}
