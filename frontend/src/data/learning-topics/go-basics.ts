/**
 * Learning hub — Go for beginners (reads best after “Start here”).
 */
import type { GuideSection } from "@/data/deployment-guide-sections";

export const GO_BASICS_SECTIONS: GuideSection[] = [
  {
    id: "before-go",
    eyebrow: "Order",
    title: "Read this after “Start here”",
    blocks: [
      {
        type: "p",
        text:
          "The previous tab explains computers, servers, HTTP, APIs, DNS, and localhost in plain language. This tab starts using Go, line by line. If a word like “handler” confuses you, finish Start here first.",
      },
    ],
  },
  {
    id: "what-is-go",
    eyebrow: "Language",
    title: "What Go is",
    blocks: [
      {
        type: "p",
        text:
          "Go (Golang) is a programming language from Google, designed for readable, efficient programs — especially network services and command-line tools. You write `.go` text files; the `go` tool builds a runnable program.",
      },
    ],
  },
  {
    id: "package-main",
    eyebrow: "Files",
    title: "Packages, `package main`, and `func main`",
    blocks: [
      {
        type: "p",
        text:
          "Every Go file starts with `package something`. `package main` marks a runnable program. `func main()` is where execution begins — like the first step of your recipe.",
      },
      {
        type: "code",
        text: `package main

import "fmt"

func main() {
	fmt.Println("Hello")
}`,
      },
    ],
  },
  {
    id: "imports",
    eyebrow: "Reuse",
    title: "`import` — using the standard library and other packages",
    blocks: [
      {
        type: "p",
        text:
          "Import brings in another package’s names. The fmt package (short for format) handles printing. Only identifiers that start with a capital letter are exported — visible outside that package.",
      },
      {
        type: "code",
        text: `import (
	"fmt"
	"strings"
)

func main() {
	fmt.Println(strings.ToUpper("hello"))
}`,
      },
    ],
  },
  {
    id: "scope",
    eyebrow: "Visibility",
    title: "Scope — where a name is valid",
    blocks: [
      {
        type: "p",
        text:
          "Package-level declarations (`var`, `const`, `func`, `type`) are visible in all files of that package. Inside a function, names declared with `:=` or inner `var` exist only inside the nearest `{` `}` block. Inner can hide outer (shadowing) — beginners should avoid reusing the same short names.",
      },
    ],
  },
  {
    id: "functions",
    eyebrow: "Building blocks",
    title: "Functions — parameters and return values",
    blocks: [
      {
        type: "p",
        text:
          "A function groups work under a name. You can pass values in and get values out. Go allows multiple return values — very often `(result, error)`.",
      },
      {
        type: "code",
        text: `package main

import "fmt"

func add(a int, b int) int {
	return a + b
}

// returns two ints — common for “value + error” patterns later
func divide(a, b int) (int, bool) {
	if b == 0 {
		return 0, false
	}
	return a / b, true
}

func main() {
	fmt.Println(add(2, 3))
	if q, ok := divide(10, 2); ok {
		fmt.Println("quotient", q)
	}
}`,
      },
    ],
  },
  {
    id: "var-const",
    eyebrow: "Names",
    title: "Variables (`var`, `:=`) and constants (`const`)",
    blocks: [
      {
        type: "p",
        text:
          "Inside a function, `name := value` declares and assigns. Outside, use `var name type = value`. `const` is for values fixed at compile time (numbers, strings, booleans).",
      },
      {
        type: "code",
        text: `package main

import "fmt"

const greeting = "Hi"

func main() {
	var count int = 1
	name := "Alex"
	count = 2
	fmt.Println(greeting, name, count)
}`,
      },
    ],
  },
  {
    id: "basic-types",
    eyebrow: "Data",
    title: "Basic data types",
    blocks: [
      {
        type: "ul",
        items: [
          "`bool` — true or false.",
          "`string` — text; immutable sequence of bytes interpreted as UTF-8.",
          "`int`, `int64`, `uint`, … — integers with different sizes.",
          "`float64` — decimal numbers (many APIs use this).",
          "`byte` — alias for `uint8`; often raw bytes.",
          "`rune` — alias for `int32`; one Unicode code point.",
        ],
      },
    ],
  },
  {
    id: "if-for-switch",
    eyebrow: "Control flow",
    title: "`if`, `for`, and `switch`",
    blocks: [
      {
        type: "p",
        text:
          "Go has only `for` for loops (no separate `while`). `range` walks slices, arrays, maps, strings, and channels — you will use it constantly.",
      },
      {
        type: "code",
        text: `package main

import "fmt"

func main() {
	for i := 0; i < 3; i++ {
		fmt.Println(i)
	}

	n := 2
	for n < 100 {
		n *= 2
	}

	for { // endless until break
		break
	}
}`,
      },
    ],
  },
  {
    id: "arrays",
    eyebrow: "Fixed length",
    title: "Arrays — size is part of the type",
    blocks: [
      {
        type: "p",
        text:
          "`[3]int` and `[4]int` are different types. Arrays are rarely used alone in application code; slices are more common. Still, knowing arrays explains how slices work underneath.",
      },
      {
        type: "code",
        text: `package main

func main() {
	var a [2]string
	a[0] = "first"
	a[1] = "second"

	b := [3]int{10, 20, 30}
	_ = a
	_ = b
}`,
      },
    ],
  },
  {
    id: "slices",
    eyebrow: "Dynamic lists",
    title: "Slices — append, length, capacity, re-slicing",
    blocks: [
      {
        type: "p",
        text:
          "A slice is a flexible view over an underlying array. `len` is the number of elements you can use; `cap` is how much room exists before the backing array must grow. `append` may allocate a new backing array when full.",
      },
      {
        type: "code",
        text: `package main

import "fmt"

func main() {
	nums := []int{1, 2, 3}
	nums = append(nums, 4)
	fmt.Println(len(nums), cap(nums))

	// half-open range: indices 1 up to (not including) 3
	part := nums[1:3]
	_ = part
}`,
      },
    ],
  },
  {
    id: "range-slices",
    eyebrow: "Loops",
    title: "`range` over a slice — index, value, and `_`",
    blocks: [
      {
        type: "p",
        text:
          "Use `for i, v := range items` when you need both index and value. Use `for i := range items` when only the index matters. Use `for _, v := range items` when you ignore the index — the blank identifier `_` throws away that slot.",
      },
      {
        type: "code",
        text: `names := []string{"ada", "linus"}
for i, name := range names {
	fmt.Println(i, name)
}

for _, name := range names {
	fmt.Println(name)
}`,
      },
    ],
  },
  {
    id: "slice-package",
    eyebrow: "Stdlib helper",
    title: "The `slices` package (Go 1.21+)",
    blocks: [
      {
        type: "p",
        text:
          "Package `slices` gives helpers like `Contains`, `Equal`, `Clone`, sorting helpers — so you write less error-prone loop code for common jobs.",
      },
      {
        type: "code",
        text: `package main

import (
	"fmt"
	"slices"
)

func main() {
	scores := []int{40, 80, 55}
	fmt.Println(slices.Contains(scores, 80))

	other := slices.Clone(scores)
	other[0] = 99
	fmt.Println(scores[0], other[0])
}`,
      },
    ],
  },
  {
    id: "sort-package",
    eyebrow: "Ordering",
    title: "The `sort` package — sorting numbers in a slice",
    blocks: [
      {
        type: "p",
        text:
          "Package `sort` orders slices in place. `sort.Ints` sorts a `[]int`; there are helpers for strings and floats too. This is separate from the `slices` helpers but pairs well when you need ranked data.",
      },
      {
        type: "code",
        text: `package main

import (
	"fmt"
	"sort"
)

func main() {
	xs := []int{30, 10, 20}
	sort.Ints(xs)
	fmt.Println(xs) // [10 20 30]
}`,
      },
    ],
  },
  {
    id: "maps",
    eyebrow: "Key-value",
    title: "Maps — dictionary from key to value",
    blocks: [
      {
        type: "p",
        text:
          "Declare with `make` or a literal. Reading `m[key]` gives the value type’s zero value if missing — use the two-value form `v, ok := m[key]` to tell “missing” from “present but zero”.",
      },
      {
        type: "code",
        text: `ages := map[string]int{"ada": 36}
ages["linus"] = 54

if v, ok := ages["ada"]; ok {
	fmt.Println("ada", v)
}

for name, age := range ages {
	fmt.Println(name, age)
}`,
      },
    ],
  },
  {
    id: "print-println",
    eyebrow: "Output",
    title: "`fmt.Print` and `fmt.Println`",
    blocks: [
      {
        type: "p",
        text:
          "`Print` writes text with no added newline. `Println` adds spaces between arguments and ends with a newline. Good for quick debugging and tiny programs.",
      },
      {
        type: "code",
        text: `fmt.Print("A", "B")   // AB
fmt.Println("A", "B") // A B + newline`,
      },
    ],
  },
  {
    id: "printf-verbs",
    eyebrow: "Formatted printing",
    title: "`fmt.Printf` — format verbs like `%s`, `%d`, `%g`",
    blocks: [
      {
        type: "p",
        text:
          "The first argument is a format string. After it, you pass one value for every `%` placeholder. This lets you control spacing and number shape.",
      },
      {
        type: "ul",
        items: [
          "`%s` — string.",
          "`%d` — integer in base 10.",
          "`%f` — floating point with default width/precision.",
          "`%g` — pick compact `%e` or `%f` for floats (nice for human logs).",
          "`%v` — default format for any value (quick but not always prettiest).",
          "`%T` — print the type of the value.",
          "`%q` — double-quoted string safe for literals.",
          "`%%` — a literal percent sign.",
        ],
      },
      {
        type: "code",
        text: `name := "Ada"
score := 98
avg := 96.5

fmt.Printf("name=%s score=%d avg=%g type=%T\\n", name, score, avg, avg)`,
      },
      {
        type: "callout",
        variant: "tip",
        title: "Newline in format",
        body:
          "At the end of the format string, use backslash-n inside the quotes for a new line. Printf does not add a line break for you.",
      },
    ],
  },
  {
    id: "sprint-family",
    eyebrow: "Build text",
    title: "`Sprint`, `Sprintln`, `Sprintf`, and `Fprintf`",
    blocks: [
      {
        type: "p",
        text:
          "Sometimes you need a string value to pass to another function or return from your own code — not send straight to the terminal. Sprint, Sprintln, and Sprintf build that string. Fprintf is the same idea as Printf but writes to a target you choose (a file, a network response writer, a memory buffer) instead of the default console.",
      },
      {
        type: "code",
        text: `msg := fmt.Sprintf("user=%s id=%d", "ada", 42)
// msg is a string variable — no console output yet
fmt.Println(msg)`,
      },
    ],
  },
  {
    id: "structs-methods-basics",
    eyebrow: "Grouping fields",
    title: "Structs and a first look at methods",
    blocks: [
      {
        type: "p",
        text:
          "A struct groups named fields. A method looks like `func (receiver Type) Name(...) ...` — it ties behavior to your type. A pointer receiver `*Type` can modify the struct in place.",
      },
      {
        type: "code",
        text: `type User struct {
	ID   int
	Name string
}

func (u *User) SetName(next string) {
	u.Name = next
}`,
      },
    ],
  },
  {
    id: "errors-basic",
    eyebrow: "No exceptions",
    title: "The `error` type — simplest use",
    blocks: [
      {
        type: "p",
        text:
          "Go uses explicit `error` returns instead of try/catch. `if err != nil { ... }` is normal. You will deepen this in the advanced track; for now, know `errors.New` and `fmt.Errorf` build errors.",
      },
      {
        type: "code",
        text: `import (
	"errors"
	"fmt"
)

func readPositive(n int) error {
	if n <= 0 {
		return errors.New("need positive n")
	}
	return fmt.Errorf("read ok: %d", n)
}`,
      },
    ],
  },
];
