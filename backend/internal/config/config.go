package config

import (
	"crypto/subtle"
	"fmt"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/joho/godotenv"
	"golang.org/x/crypto/bcrypt"
)

type Config struct {
	Port           string
	DatabaseURL    string
	JWTSecret      string
	AdminUsername  string
	AdminPassword  string
	CORSOrigins    []string
	UploadDir      string
	PublicBaseURL  string

	RazorpayKeyID     string
	RazorpayKeySecret string

	SMTPHost     string
	SMTPPort     int
	SMTPUser     string
	SMTPPassword string
	AdminEmail   string
	FromEmail    string

	WhatsAppPhone string

	// Twilio (optional): SMS + WhatsApp outbound via Messages API
	TwilioAccountSID  string
	TwilioAuthToken   string
	TwilioSMSFrom     string // E.164 e.g. +15551234567
	TwilioWhatsAppFrom string // whatsapp:+14155238886

	// Public announcements (returned by GET /api/public/announcements)
	FeeIncreasePercent int    // e.g. 25
	FeeIncreaseDays    int    // e.g. 10 — “within next N days”
	FeeIncreaseMessage string // optional override

	PaymentDefaultRupees string

	// Paid consultation booking (GET /api/public/consultation/*)
	ConsultFeeRupees     string
	ConsultTimezoneName  string
	ConsultWeekdays      string // e.g. "1,2,3,4,5" = Mon–Fri (1=Mon … 7=Sun)
	ConsultStartHour     int
	ConsultStartMinute   int
	ConsultEndHour       int
	ConsultEndMinute     int
	ConsultSlotMinutes   int
}

func Load() (*Config, error) {
	_ = godotenv.Load()

	smtpPort, _ := strconv.Atoi(getEnv("SMTP_PORT", "587"))

	c := &Config{
		Port:                 getEnv("PORT", "8080"),
		DatabaseURL:          getEnv("DATABASE_URL", "postgres://goscale:goscale@localhost:5432/gopher_lab?sslmode=disable"),
		JWTSecret:            getEnv("JWT_SECRET", "change-me-in-production"),
		AdminUsername:        getEnv("ADMIN_USERNAME", "admin"),
		// Plain-text dev default; override with ADMIN_PASSWORD in .env (use bcrypt hash when GIN_MODE=release).
		AdminPassword:        getEnv("ADMIN_PASSWORD", "admin123"),
		UploadDir:            getEnv("UPLOAD_DIR", "./uploads"),
		PublicBaseURL:        publicBaseURL(),
		RazorpayKeyID:        os.Getenv("RAZORPAY_KEY_ID"),
		RazorpayKeySecret:    os.Getenv("RAZORPAY_KEY_SECRET"),
		SMTPHost:             os.Getenv("SMTP_HOST"),
		SMTPPort:             smtpPort,
		SMTPUser:             os.Getenv("SMTP_USER"),
		SMTPPassword:         os.Getenv("SMTP_PASSWORD"),
		AdminEmail:           os.Getenv("ADMIN_ALERT_EMAIL"),
		FromEmail:            getEnv("FROM_EMAIL", "noreply@goscalelabs.com"),
		WhatsAppPhone:        getEnv("WHATSAPP_BUSINESS_NUMBER", ""),
		TwilioAccountSID:     os.Getenv("TWILIO_ACCOUNT_SID"),
		TwilioAuthToken:      os.Getenv("TWILIO_AUTH_TOKEN"),
		TwilioSMSFrom:        os.Getenv("TWILIO_SMS_FROM"),
		TwilioWhatsAppFrom:   os.Getenv("TWILIO_WHATSAPP_FROM"),
		FeeIncreasePercent:   intFromEnv("FEE_INCREASE_PERCENT", 25),
		FeeIncreaseDays:      intFromEnv("FEE_INCREASE_DAYS", 10),
		FeeIncreaseMessage:   os.Getenv("FEE_INCREASE_MESSAGE"),
		PaymentDefaultRupees: getEnv("DEFAULT_PAYMENT_RUPEES", "250000"),
		ConsultFeeRupees:     getEnv("CONSULT_FEE_RUPEES", "10000"),
		ConsultTimezoneName:  getEnv("CONSULT_TIMEZONE", "Asia/Kolkata"),
		ConsultWeekdays:      getEnv("CONSULT_WEEKDAYS", "1,2,3,4,5"),
		ConsultStartHour:     intFromEnv("CONSULT_START_HOUR", 10),
		ConsultStartMinute:   intFromEnv("CONSULT_START_MINUTE", 0),
		ConsultEndHour:       intFromEnv("CONSULT_END_HOUR", 18),
		ConsultEndMinute:     intFromEnv("CONSULT_END_MINUTE", 0),
		ConsultSlotMinutes:   intFromEnv("CONSULT_SLOT_MINUTES", 30),
	}

	cors := getEnv("CORS_ORIGINS", "http://localhost:3000")
	c.CORSOrigins = splitComma(cors)

	if c.JWTSecret == "change-me-in-production" {
		if getEnv("GIN_MODE", "") == "release" {
			return nil, fmt.Errorf("JWT_SECRET must be set in production")
		}
	}
	if getEnv("GIN_MODE", "") == "release" && c.AdminPassword != "" && !strings.HasPrefix(c.AdminPassword, "$2") {
		return nil, fmt.Errorf("ADMIN_PASSWORD must be a bcrypt hash when GIN_MODE=release")
	}

	return c, nil
}

// CheckAdminPassword accepts a bcrypt hash in ADMIN_PASSWORD (prefix $2) or a plain password for local dev.
func (c *Config) CheckAdminPassword(password string) bool {
	if strings.HasPrefix(c.AdminPassword, "$2") {
		return bcrypt.CompareHashAndPassword([]byte(c.AdminPassword), []byte(password)) == nil
	}
	if c.AdminPassword == "" {
		return false
	}
	return subtle.ConstantTimeCompare([]byte(c.AdminPassword), []byte(password)) == 1
}

func (c *Config) DefaultPaymentRupees() string {
	if c.PaymentDefaultRupees == "" {
		return "250000"
	}
	return c.PaymentDefaultRupees
}

// ConsultTimezone returns IANA zone for availability (defaults to Asia/Kolkata).
func (c *Config) ConsultTimezone() string {
	if c.ConsultTimezoneName != "" {
		return c.ConsultTimezoneName
	}
	return "Asia/Kolkata"
}

func (c *Config) ConsultFeeRupeesString() string {
	if c.ConsultFeeRupees != "" {
		return c.ConsultFeeRupees
	}
	return "10000"
}

func (c *Config) ConsultSlotDurationMinutes() int {
	if c.ConsultSlotMinutes <= 0 {
		return 30
	}
	return c.ConsultSlotMinutes
}

func (c *Config) ConsultStartClock() (hour, min int) {
	return c.ConsultStartHour, c.ConsultStartMinute
}

func (c *Config) ConsultEndClock() (hour, min int) {
	return c.ConsultEndHour, c.ConsultEndMinute
}

// ConsultWeekdaySet keys: 1=Mon … 7=Sun (ISO).
func (c *Config) ConsultWeekdaySet() map[int]bool {
	m, err := parseConsultWeekdays(c.ConsultWeekdays)
	if err != nil || len(m) == 0 {
		return map[int]bool{1: true, 2: true, 3: true, 4: true, 5: true}
	}
	return m
}

func parseConsultWeekdays(s string) (map[int]bool, error) {
	out := make(map[int]bool)
	s = strings.TrimSpace(s)
	if s == "" {
		for i := 1; i <= 5; i++ {
			out[i] = true
		}
		return out, nil
	}
	for _, p := range strings.Split(s, ",") {
		p = strings.TrimSpace(p)
		if p == "" {
			continue
		}
		n, err := strconv.Atoi(p)
		if err != nil || n < 1 || n > 7 {
			return nil, fmt.Errorf("invalid weekday: %s", p)
		}
		out[n] = true
	}
	return out, nil
}

func (c *Config) JWTExpiry() time.Duration {
	d, err := time.ParseDuration(getEnv("JWT_EXPIRY", "24h"))
	if err != nil {
		return 24 * time.Hour
	}
	return d
}

func publicBaseURL() string {
	if v := os.Getenv("PUBLIC_BASE_URL"); v != "" {
		return trimSlash(v)
	}
	// Render sets https://<service>.onrender.com
	if v := os.Getenv("RENDER_EXTERNAL_URL"); v != "" {
		return trimSlash(v)
	}
	return "http://localhost:8080"
}

func getEnv(key, def string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return def
}

func intFromEnv(key string, def int) int {
	s := os.Getenv(key)
	if s == "" {
		return def
	}
	n, err := strconv.Atoi(s)
	if err != nil {
		return def
	}
	return n
}

func splitComma(s string) []string {
	var out []string
	for _, p := range split(s, ',') {
		if p != "" {
			out = append(out, p)
		}
	}
	return out
}

func split(s string, sep rune) []string {
	var cur string
	var res []string
	for _, r := range s {
		if r == sep {
			res = append(res, cur)
			cur = ""
			continue
		}
		cur += string(r)
	}
	res = append(res, cur)
	return res
}

func trimSlash(u string) string {
	for len(u) > 0 && u[len(u)-1] == '/' {
		u = u[:len(u)-1]
	}
	return u
}
