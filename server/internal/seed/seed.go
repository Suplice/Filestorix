package seed

import (
	"time"

	"github.com/Suplice/Filestorix/internal/models"
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

func SeedTestData(db *gorm.DB) error {
	// ====================
	// Wyczyść tabele (Twoja logika jest OK)
	// ====================
	tables := []string{
		"user_answers",
		"user_task_progresses",
		"task_questions",
		"tasks",
		"badges",
		"friendships",
		"settings",
		"users",
	}

	for _, t := range tables {
		if err := db.Exec("TRUNCATE TABLE " + t + " RESTART IDENTITY CASCADE;").Error; err != nil {
			return err
		}
	}

	// ====================
	// 1. Użytkownicy (Twoje dane są OK)
	// ====================
	users := []models.User{
		{Username: "alice", Email: "alice@example.com", Provider: "EMAIL", AvatarURL: "https://i.pravatar.cc/150?img=1", Role: "user", Level: 3, XP: 120, Points: 50, StreakCount: 5, LastActiveDate: time.Now()},
		{Username: "bob", Email: "bob@example.com", Provider: "EMAIL", AvatarURL: "https://i.pravatar.cc/150?img=2", Role: "user", Level: 2, XP: 70, Points: 20, StreakCount: 2, LastActiveDate: time.Now()},
	}
	for _, u := range users {
		if err := db.Create(&u).Error; err != nil {
			return err
		}
	}

	// ====================
	// 2. Odznaki (Twoje dane są OK)
	// ====================
	// ... (kod dla odznak) ...

	// ====================
	// 3. Zadania — 4 nowe/zaktualizowane zadania
	// ====================
	tasks := []models.Task{
		// === Istniejące ===
		{Title: "Podstawy Pythona", Description: "Quiz wielokrotnego wyboru o zmiennych i typach.", Type: "QUIZ", Language: "Python", Difficulty: "EASY", Points: 10, XP: 5},                                    // ID: 1
		{Title: "JavaScript - ES6", Description: "Sprawdź swoją wiedzę o funkcjach strzałkowych i `let`/`const`.", Type: "QUIZ", Language: "JavaScript", Difficulty: "EASY", Points: 15, XP: 10},        // ID: 2
		{Title: "Deklaracje w Go", Description: "Uzupełnij luki w kodzie Go.", Type: "FILL_BLANK", Language: "Go", Difficulty: "MEDIUM", Points: 20, XP: 15},                                           // ID: 3
		{Title: "Instrukcje SQL", Description: "Dokończ popularne zapytania SQL.", Type: "FILL_BLANK", Language: "General", Difficulty: "MEDIUM", Points: 20, XP: 15},                                 // ID: 4

		// === Nowe zadania ===

		// --- Python ---
		{Title: "Python - Pętle i Listy", Description: "Quiz dotyczący pętli for/while i operacji na listach.", Type: "QUIZ", Language: "Python", Difficulty: "MEDIUM", Points: 25, XP: 15},            // ID: 5
		{Title: "Python - Funkcje", Description: "Uzupełnij definicje prostych funkcji w Pythonie.", Type: "FILL_BLANK", Language: "Python", Difficulty: "MEDIUM", Points: 30, XP: 20},              // ID: 6
		{Title: "Python - Klasy i Obiekty", Description: "Quiz o podstawach programowania obiektowego w Pythonie.", Type: "QUIZ", Language: "Python", Difficulty: "HARD", Points: 45, XP: 30},        // ID: 7

		// --- Go ---
		{Title: "Go - Struktury i Metody", Description: "Quiz o definiowaniu struktur i metod w Go.", Type: "QUIZ", Language: "Go", Difficulty: "MEDIUM", Points: 30, XP: 20},                       // ID: 8
		{Title: "Go - Goroutines", Description: "Uzupełnij kod związany z podstawami współbieżności.", Type: "FILL_BLANK", Language: "Go", Difficulty: "HARD", Points: 50, XP: 35},                 // ID: 9

		// --- JavaScript ---
		{Title: "JavaScript - Operacje na Tablicach", Description: "Quiz o metodach tablicowych jak map, filter, reduce.", Type: "QUIZ", Language: "JavaScript", Difficulty: "MEDIUM", Points: 35, XP: 25}, // ID: 10
		{Title: "JavaScript - Asynchroniczność", Description: "Uzupełnij kod używając async/await i Promises.", Type: "FILL_BLANK", Language: "JavaScript", Difficulty: "HARD", Points: 55, XP: 40}, // ID: 11

		// --- TypeScript ---
		{Title: "TypeScript - Podstawowe Typy", Description: "Quiz o typach podstawowych i interfejsach.", Type: "QUIZ", Language: "TypeScript", Difficulty: "EASY", Points: 15, XP: 10},               // ID: 12
		{Title: "TypeScript - Generics", Description: "Uzupełnij kod z użyciem typów generycznych.", Type: "FILL_BLANK", Language: "TypeScript", Difficulty: "MEDIUM", Points: 30, XP: 20},          // ID: 13
		{Title: "TypeScript - Zaawansowane Typy", Description: "Quiz o typach unijnych, warunkowych i utility types.", Type: "QUIZ", Language: "TypeScript", Difficulty: "HARD", Points: 50, XP: 35}, // ID: 14

		// --- C# ---
		{Title: "C# - Podstawy Składni", Description: "Quiz o zmiennych, typach i instrukcjach warunkowych.", Type: "QUIZ", Language: "C#", Difficulty: "EASY", Points: 10, XP: 5},                     // ID: 15
		{Title: "C# - Klasy i Metody", Description: "Uzupełnij definicje klas i metod w C#.", Type: "FILL_BLANK", Language: "C#", Difficulty: "MEDIUM", Points: 25, XP: 15},                      // ID: 16
		{Title: "C# - LINQ", Description: "Quiz o podstawowych zapytaniach LINQ.", Type: "QUIZ", Language: "C#", Difficulty: "HARD", Points: 45, XP: 30},                                          // ID: 17

		// --- General / Algorithms ---
		{Title: "Algorytmy - Notacja Big O", Description: "Quiz o podstawach złożoności obliczeniowej.", Type: "QUIZ", Language: "Algorithms", Difficulty: "EASY", Points: 20, XP: 15},              // ID: 18
		{Title: "Algorytmy - Sortowanie", Description: "Uzupełnij nazwy popularnych algorytmów sortowania.", Type: "FILL_BLANK", Language: "Algorithms", Difficulty: "MEDIUM", Points: 35, XP: 25}, // ID: 19
		{Title: "Algorytmy - Struktury Danych", Description: "Quiz o stosach, kolejkach i listach powiązanych.", Type: "QUIZ", Language: "Algorithms", Difficulty: "HARD", Points: 60, XP: 45},     // ID: 20
		{Title: "Python - Słowniki", Description: "Quiz o tworzeniu i modyfikowaniu słowników.", Type: "QUIZ", Language: "Python", Difficulty: "EASY", Points: 15, XP: 10},                                         // ID: 21
		{Title: "Python - Obsługa Wyjątków", Description: "Uzupełnij bloki try/except.", Type: "FILL_BLANK", Language: "Python", Difficulty: "MEDIUM", Points: 30, XP: 20},                                  // ID: 22
		{Title: "Python - List Comprehensions", Description: "Quiz o tworzeniu list w skróconej formie.", Type: "QUIZ", Language: "Python", Difficulty: "HARD", Points: 50, XP: 35},                        // ID: 23

		// --- Go ---
		{Title: "Go - Interfejsy", Description: "Quiz o definiowaniu i implementacji interfejsów.", Type: "QUIZ", Language: "Go", Difficulty: "MEDIUM", Points: 35, XP: 25},                                 // ID: 24
		{Title: "Go - Obsługa Błędów", Description: "Uzupełnij typowy wzorzec obsługi błędów w Go.", Type: "FILL_BLANK", Language: "Go", Difficulty: "EASY", Points: 15, XP: 10},                            // ID: 25

		// --- JavaScript ---
		{Title: "JavaScript - DOM Manipulation", Description: "Quiz o podstawach manipulacji drzewem DOM.", Type: "QUIZ", Language: "JavaScript", Difficulty: "MEDIUM", Points: 30, XP: 20},              // ID: 26
		{Title: "JavaScript - Hoisting", Description: "Uzupełnij luki dotyczące hoistingu zmiennych i funkcji.", Type: "FILL_BLANK", Language: "JavaScript", Difficulty: "HARD", Points: 45, XP: 30},        // ID: 27
		{Title: "JavaScript - Promises", Description: "Quiz dotyczący tworzenia i obsługi Promises.", Type: "QUIZ", Language: "JavaScript", Difficulty: "HARD", Points: 55, XP: 40},                       // ID: 28

		// --- TypeScript ---
		{Title: "TypeScript - Klasy", Description: "Quiz o modyfikatorach dostępu i dziedziczeniu w klasach.", Type: "QUIZ", Language: "TypeScript", Difficulty: "MEDIUM", Points: 30, XP: 20},            // ID: 29
		{Title: "TypeScript - Enums", Description: "Uzupełnij definicje i użycie enumów.", Type: "FILL_BLANK", Language: "TypeScript", Difficulty: "EASY", Points: 15, XP: 10},                            // ID: 30

		// --- C# ---
		{Title: "C# - Kolekcje", Description: "Quiz o List<T>, Dictionary<TKey, TValue>.", Type: "QUIZ", Language: "C#", Difficulty: "MEDIUM", Points: 35, XP: 25},                                     // ID: 31
		{Title: "C# - Properties", Description: "Uzupełnij definicje właściwości (get/set).", Type: "FILL_BLANK", Language: "C#", Difficulty: "EASY", Points: 20, XP: 15},                                 // ID: 32
		{Title: "C# - Async/Await", Description: "Quiz o programowaniu asynchronicznym w C#.", Type: "QUIZ", Language: "C#", Difficulty: "HARD", Points: 60, XP: 45},                                  // ID: 33

		// --- General / Algorithms ---
		{Title: "Podstawy HTML", Description: "Quiz o podstawowych znacznikach HTML.", Type: "QUIZ", Language: "General", Difficulty: "EASY", Points: 10, XP: 5},                                          // ID: 34
		{Title: "Podstawy CSS", Description: "Uzupełnij selektory i właściwości CSS.", Type: "FILL_BLANK", Language: "General", Difficulty: "EASY", Points: 15, XP: 10},                                  // ID: 35
		{Title: "Wzorce Projektowe - Singleton", Description: "Quiz o wzorcu Singleton.", Type: "QUIZ", Language: "General", Difficulty: "MEDIUM", Points: 30, XP: 20},                                  // ID: 36
		{Title: "Algorytmy - Rekurencja", Description: "Quiz o podstawach rekurencji.", Type: "QUIZ", Language: "Algorithms", Difficulty: "MEDIUM", Points: 40, XP: 25},                                 // ID: 37
		{Title: "Algorytmy - Drzewa Binarne", Description: "Uzupełnij terminy związane z drzewami binarnymi.", Type: "FILL_BLANK", Language: "Algorithms", Difficulty: "HARD", Points: 55, XP: 40},       // ID: 38
		{Title: "Algorytmy - Grafy", Description: "Quiz o podstawach teorii grafów i algorytmach grafowych.", Type: "QUIZ", Language: "Algorithms", Difficulty: "HARD", Points: 70, XP: 50},               // ID: 39
		{Title: "Sieci Komputerowe - Model OSI", Description: "Uzupełnij nazwy warstw modelu OSI.", Type: "FILL_BLANK", Language: "General", Difficulty: "MEDIUM", Points: 40, XP: 25},                   // ID: 40
	}


	// Ważne: Tworzymy zadania w transakcji, aby zachować kolejność ID (1, 2, 3, 4)
	if err := db.Create(&tasks).Error; err != nil {
		return err
	}

	// ====================
	// 4. Pytania do zadań
	// ====================
	questions := []models.TaskQuestion{
		// === Istniejące ===
		// Task 1 (Python EASY QUIZ)
		{TaskID: 1, QuestionText: "W Pythonie zmienna może zmienić swój typ w czasie działania programu.", Type: "QUIZ", Options: datatypes.JSON([]byte(`["Prawda","Fałsz"]`)), CorrectAnswer: "Prawda"},
		{TaskID: 1, QuestionText: "Które z poniższych NIE jest wbudowanym typem danych w Pythonie?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["List","Dictionary","Tuple","Array"]`)), CorrectAnswer: "Array"},
		{TaskID: 1, QuestionText: "Jakim operatorem sprawdzisz typ zmiennej `x`?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["typeof(x)","type(x)","isType(x)","x.type"]`)), CorrectAnswer: "type(x)"},
		// Task 2 (JavaScript EASY QUIZ)
		{TaskID: 2, QuestionText: "Które słowo kluczowe pozwala na deklarację zmiennej, której nie można ponownie przypisać?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["var","let","const","static"]`)), CorrectAnswer: "const"},
		{TaskID: 2, QuestionText: "Funkcje strzałkowe `() => {}` nie posiadają własnego kontekstu `this`.", Type: "QUIZ", Options: datatypes.JSON([]byte(`["Prawda","Fałsz"]`)), CorrectAnswer: "Prawda"},
		// Task 3 (Go MEDIUM FILL_BLANK)
		{TaskID: 3, QuestionText: "W Go, uzyj słowa `___`, aby zadeklarować nową zmienną z automatyczną inferencją typu (tylko wewnątrz funkcji).", Type: "FILL_BLANK", CorrectAnswer: ":="},
		{TaskID: 3, QuestionText: "Zadeklaruj stałą o nazwie `Version` z wartością 1.1: `___ Version = 1.1`", Type: "FILL_BLANK", CorrectAnswer: "const"},
		{TaskID: 3, QuestionText: "Słowo kluczowe do importowania pakietów to `___`.", Type: "FILL_BLANK", CorrectAnswer: "import"},
		// Task 4 (General MEDIUM FILL_BLANK - SQL)
		{TaskID: 4, QuestionText: "Aby pobrać wszystkie kolumny z tabeli `users`, wpisz: `SELECT ___ FROM users;`", Type: "FILL_BLANK", CorrectAnswer: "*"},
		{TaskID: 4, QuestionText: "Aby dodać nowy wiersz do tabeli `products`, wpisz: `INSERT ___ products (...) VALUES (...);`", Type: "FILL_BLANK", CorrectAnswer: "INTO"},
		{TaskID: 4, QuestionText: "Klauzula do filtrowania wyników zapytania to `___`.", Type: "FILL_BLANK", CorrectAnswer: "WHERE"},

		// === Nowe pytania ===

		// Task 5 (Python MEDIUM QUIZ - Pętle i Listy)
		{TaskID: 5, QuestionText: "Która pętla jest lepsza, gdy znamy dokładną liczbę iteracji?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["for","while","do...while","repeat"]`)), CorrectAnswer: "for"},
		{TaskID: 5, QuestionText: "Jak dodać element `5` na koniec listy `my_list`?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["my_list.add(5)","my_list.append(5)","my_list.push(5)","my_list.insert(5)"]`)), CorrectAnswer: "my_list.append(5)"},
		{TaskID: 5, QuestionText: "Co zwróci `my_list[-1]` dla listy `my_list = [1, 2, 3]`?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["1","2","3","Błąd"]`)), CorrectAnswer: "3"},

		// Task 6 (Python MEDIUM FILL_BLANK - Funkcje)
		{TaskID: 6, QuestionText: "Zdefiniuj funkcję o nazwie `greet` przyjmującą jeden argument `name`: `___ greet(name):`", Type: "FILL_BLANK", CorrectAnswer: "def"},
		{TaskID: 6, QuestionText: "Zwróć wartość `result` z funkcji: `___ result`", Type: "FILL_BLANK", CorrectAnswer: "return"},
		{TaskID: 6, QuestionText: "Jak zdefiniować parametr `age` z wartością domyślną 30? `def person(name, age=___):`", Type: "FILL_BLANK", CorrectAnswer: "30"},

		// Task 7 (Python HARD QUIZ - Klasy i Obiekty)
		{TaskID: 7, QuestionText: "Jak nazywa się specjalna metoda inicjalizująca obiekt klasy w Pythonie?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["__init__","__new__","__create__","__constructor__"]`)), CorrectAnswer: "__init__"},
		{TaskID: 7, QuestionText: "Słowo kluczowe używane do odwołania się do instancji obiektu wewnątrz metody klasy to:", Type: "QUIZ", Options: datatypes.JSON([]byte(`["this","object","instance","self"]`)), CorrectAnswer: "self"},
		{TaskID: 7, QuestionText: "Co oznacza dziedziczenie w programowaniu obiektowym?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["Klasa może używać metod innej klasy","Klasa tworzy instancje innej klasy","Klasa przejmuje właściwości i metody innej klasy","Klasa ukrywa swoje wewnętrzne działanie"]`)), CorrectAnswer: "Klasa przejmuje właściwości i metody innej klasy"},

		// Task 8 (Go MEDIUM QUIZ - Struktury i Metody)
		{TaskID: 8, QuestionText: "Jakim słowem kluczowym definiujemy nową strukturę w Go?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["struct","type","class","define"]`)), CorrectAnswer: "type"},
		{TaskID: 8, QuestionText: "Jak deklaruje się metodę `Print` dla typu `*Point`?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["func (p *Point) Print()","func Print(p *Point)","method Print(p *Point)","def (p *Point) Print()"]`)), CorrectAnswer: "func (p *Point) Print()"},
		{TaskID: 8, QuestionText: "Czy struktura w Go może zawierać metody?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["Tak, bezpośrednio w definicji struct","Nie, metody są oddzielne","Tak, ale tylko jako wskaźniki do funkcji","Tak, definiuje się je poza struct z odbiornikiem (receiver)"]`)), CorrectAnswer: "Tak, definiuje się je poza struct z odbiornikiem (receiver)"},

		// Task 9 (Go HARD FILL_BLANK - Goroutines)
		{TaskID: 9, QuestionText: "Aby uruchomić funkcję `myFunc` jako goroutine, napisz: `___ myFunc()`", Type: "FILL_BLANK", CorrectAnswer: "go"},
		{TaskID: 9, QuestionText: "Zadeklaruj kanał (channel) dla typu `int`: `myChan := ___ chan int`", Type: "FILL_BLANK", CorrectAnswer: "make"},
		{TaskID: 9, QuestionText: "Wyślij wartość `10` do kanału `ch`: `ch ___ 10`", Type: "FILL_BLANK", CorrectAnswer: "<-"},
		{TaskID: 9, QuestionText: "Odbierz wartość z kanału `ch` do zmiennej `val`: `val ___ ___ ch`", Type: "FILL_BLANK", CorrectAnswer: ":= <-"}, // Przyjmuję ":= <-" jako poprawną odpowiedź

		// Task 10 (JavaScript MEDIUM QUIZ - Operacje na Tablicach)
		{TaskID: 10, QuestionText: "Która metoda tworzy nową tablicę z wynikami wywołania funkcji dla każdego elementu?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["forEach","map","filter","reduce"]`)), CorrectAnswer: "map"},
		{TaskID: 10, QuestionText: "Która metoda tworzy nową tablicę zawierającą tylko elementy spełniające warunek?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["forEach","map","filter","reduce"]`)), CorrectAnswer: "filter"},
		{TaskID: 10, QuestionText: "Która metoda wykonuje funkcję 'redukującą' na każdym elemencie, zwracając pojedynczą wartość?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["forEach","map","filter","reduce"]`)), CorrectAnswer: "reduce"},

		// Task 11 (JavaScript HARD FILL_BLANK - Asynchroniczność)
		{TaskID: 11, QuestionText: "Oznacz funkcję jako asynchroniczną słowem kluczowym: `___ function myAsyncFunc() { ... }`", Type: "FILL_BLANK", CorrectAnswer: "async"},
		{TaskID: 11, QuestionText: "Poczekaj na zakończenie Promise `myPromise` wewnątrz funkcji async: `const result = ___ myPromise;`", Type: "FILL_BLANK", CorrectAnswer: "await"},
		{TaskID: 11, QuestionText: "Obsłuż błąd w bloku `async/await` za pomocą `___ { ... } catch(err) { ... }`", Type: "FILL_BLANK", CorrectAnswer: "try"},
		{TaskID: 11, QuestionText: "Metoda obiektu Promise do obsługi pomyślnego zakończenia to `___`.", Type: "FILL_BLANK", CorrectAnswer: ".then()"}, // Przyjmuję ".then()" lub "then"

		// Task 12 (TypeScript EASY QUIZ - Podstawowe Typy)
		{TaskID: 12, QuestionText: "Jak zadeklarować zmienną `age` typu liczbowego w TypeScript?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["let age: number;","let age = number;","let age: Number;","let age: int;"]`)), CorrectAnswer: "let age: number;"},
		{TaskID: 12, QuestionText: "Słowo kluczowe do zdefiniowania własnego kształtu obiektu to:", Type: "QUIZ", Options: datatypes.JSON([]byte(`["type","struct","interface","object"]`)), CorrectAnswer: "interface"}, // Lub 'type'
		{TaskID: 12, QuestionText: "Jak zdefiniować tablicę stringów `names`?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["let names: string[];","let names: Array<string>;","Oba powyższe","Żadne z powyższych"]`)), CorrectAnswer: "Oba powyższe"},

		// Task 13 (TypeScript MEDIUM FILL_BLANK - Generics)
		{TaskID: 13, QuestionText: "Zdefiniuj funkcję generyczną `identity`, która przyjmuje argument typu `T` i zwraca wartość tego samego typu: `function identity<___>(arg: T): T { return arg; }`", Type: "FILL_BLANK", CorrectAnswer: "T"},
		{TaskID: 13, QuestionText: "Użyj typu generycznego `Array` do zadeklarowania tablicy liczb: `let list: Array<___> = [1, 2, 3];`", Type: "FILL_BLANK", CorrectAnswer: "number"},

		// Task 14 (TypeScript HARD QUIZ - Zaawansowane Typy)
		{TaskID: 14, QuestionText: "Jak zdefiniować typ `Result`, który może być stringiem LUB liczbą?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["type Result = string | number;","type Result = string & number;","type Result = string or number;","interface Result { string; number; }"]`)), CorrectAnswer: "type Result = string | number;"},
		{TaskID: 14, QuestionText: "Który 'Utility Type' tworzy typ, w którym wszystkie właściwości typu `T` są opcjonalne?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["Required<T>","Partial<T>","Readonly<T>","Pick<T>"]`)), CorrectAnswer: "Partial<T>"},
		{TaskID: 14, QuestionText: "Typ `never` w TypeScript reprezentuje:", Type: "QUIZ", Options: datatypes.JSON([]byte(`["Wartość null lub undefined","Wartość, która nigdy nie wystąpi","Dowolny typ","Typ nieznany"]`)), CorrectAnswer: "Wartość, która nigdy nie wystąpi"},

		// Task 15 (C# EASY QUIZ - Podstawy Składni)
		{TaskID: 15, QuestionText: "Jak zadeklarować zmienną całkowitoliczbową `count` w C#?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["var count;","int count;","integer count;","count: int;"]`)), CorrectAnswer: "int count;"},
		{TaskID: 15, QuestionText: "Który operator służy do porównania równości wartości w C#?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["=","==",":=","==="]`)), CorrectAnswer: "=="},
		{TaskID: 15, QuestionText: "Jak wypisać tekst 'Hello' na konsoli?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["print('Hello');","Console.WriteLine(\"Hello\");","echo 'Hello';","System.out.println(\"Hello\");"]`)), CorrectAnswer: "Console.WriteLine(\"Hello\");"},

		// Task 16 (C# MEDIUM FILL_BLANK - Klasy i Metody)
		{TaskID: 16, QuestionText: "Zdefiniuj publiczną klasę o nazwie `Person`: `___ class Person { ... }`", Type: "FILL_BLANK", CorrectAnswer: "public"},
		{TaskID: 16, QuestionText: "Zadeklaruj publiczną metodę `Speak`, która nic nie zwraca (void): `public ___ Speak() { ... }`", Type: "FILL_BLANK", CorrectAnswer: "void"},
		{TaskID: 16, QuestionText: "Słowo kluczowe do stworzenia nowej instancji klasy `Car`: `Car myCar = ___ Car();`", Type: "FILL_BLANK", CorrectAnswer: "new"},

		// Task 17 (C# HARD QUIZ - LINQ)
		{TaskID: 17, QuestionText: "Która klauzula LINQ służy do filtrowania kolekcji?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["Select","Where","OrderBy","GroupBy"]`)), CorrectAnswer: "Where"},
		{TaskID: 17, QuestionText: "Która klauzula LINQ służy do transformacji elementów kolekcji?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["Select","Where","OrderBy","GroupBy"]`)), CorrectAnswer: "Select"},
		{TaskID: 17, QuestionText: "Która metoda LINQ zwraca pierwszy element kolekcji lub wartość domyślną, jeśli kolekcja jest pusta?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["First()","Single()","FirstOrDefault()","ElementAt(0)"]`)), CorrectAnswer: "FirstOrDefault()"},

		// Task 18 (Algorithms EASY QUIZ - Big O)
		{TaskID: 18, QuestionText: "Co opisuje notacja Big O?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["Dokładny czas wykonania algorytmu","Złożoność pamięciową algorytmu","Jak czas wykonania algorytmu rośnie wraz z rozmiarem danych wejściowych","Liczbę linii kodu w algorytmie"]`)), CorrectAnswer: "Jak czas wykonania algorytmu rośnie wraz z rozmiarem danych wejściowych"},
		{TaskID: 18, QuestionText: "Która złożoność jest najbardziej efektywna (najszybsza) dla dużych N?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["O(N^2)","O(N log N)","O(N)","O(1)"]`)), CorrectAnswer: "O(1)"},
		{TaskID: 18, QuestionText: "Jaka jest typowa złożoność czasowa przeszukiwania liniowego nieposortowanej tablicy?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["O(1)","O(log N)","O(N)","O(N log N)"]`)), CorrectAnswer: "O(N)"},

		// Task 19 (Algorithms MEDIUM FILL_BLANK - Sortowanie)
		{TaskID: 19, QuestionText: "Algorytm sortowania, który wielokrotnie przechodzi przez listę, porównując sąsiednie elementy i zamieniając je miejscami, jeśli są w złej kolejności, to sortowanie ___.", Type: "FILL_BLANK", CorrectAnswer: "bąbelkowe"}, // bubble sort
		{TaskID: 19, QuestionText: "Algorytm sortowania 'dziel i zwyciężaj', który dzieli listę na dwie połowy, sortuje je rekurencyjnie, a następnie scala, to sortowanie przez ___.", Type: "FILL_BLANK", CorrectAnswer: "scalanie"}, // merge sort
		{TaskID: 19, QuestionText: "Algorytm sortowania, który wybiera 'pivot' i dzieli listę na elementy mniejsze i większe od pivota, to ___ sort.", Type: "FILL_BLANK", CorrectAnswer: "szybkie"}, // quick sort

		// Task 20 (Algorithms HARD QUIZ - Struktury Danych)
		{TaskID: 20, QuestionText: "Która struktura danych działa na zasadzie LIFO (Last-In, First-Out)?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["Kolejka (Queue)","Stos (Stack)","Lista powiązana (Linked List)","Drzewo binarne (Binary Tree)"]`)), CorrectAnswer: "Stos (Stack)"},
		{TaskID: 20, QuestionText: "Która struktura danych działa na zasadzie FIFO (First-In, First-Out)?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["Kolejka (Queue)","Stos (Stack)","Lista powiązana (Linked List)","Tablica (Array)"]`)), CorrectAnswer: "Kolejka (Queue)"},
		{TaskID: 20, QuestionText: "W jakiej strukturze danych każdy element (węzeł) przechowuje wskaźnik do następnego elementu?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["Tablica (Array)","Stos (Stack)","Mapa (Map)","Lista powiązana (Linked List)"]`)), CorrectAnswer: "Lista powiązana (Linked List)"},
		{TaskID: 21, QuestionText: "Jak utworzyć pusty słownik w Pythonie?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["{}","dict()","Oba powyższe","[]"]`)), CorrectAnswer: "Oba powyższe"},
		{TaskID: 21, QuestionText: "Jak dodać parę klucz-wartość ('name': 'Alice') do słownika `d`?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["d.add('name', 'Alice')","d['name'] = 'Alice'","d.insert('name', 'Alice')","d.append({'name': 'Alice'})"]`)), CorrectAnswer: "d['name'] = 'Alice'"},
		{TaskID: 21, QuestionText: "Jak sprawdzić, czy klucz 'age' istnieje w słowniku `d`?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["'age' in d","d.contains('age')","d.has_key('age')","exists(d, 'age')"]`)), CorrectAnswer: "'age' in d"},
		{TaskID: 21, QuestionText: "Jak uzyskać wartość powiązaną z kluczem 'city' w słowniku `d`?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["d.get('city')","d['city']","Oba powyższe","d.value('city')"]`)), CorrectAnswer: "Oba powyższe"},
		{TaskID: 21, QuestionText: "Jak usunąć parę z kluczem 'country' ze słownika `d`?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["del d['country']","d.pop('country')","Oba powyższe","d.remove('country')"]`)), CorrectAnswer: "Oba powyższe"},

		// Task 22 (Python MEDIUM FILL_BLANK - Obsługa Wyjątków) - 4 pytania
		{TaskID: 22, QuestionText: "Blok kodu, który może rzucić wyjątek, umieszczamy wewnątrz `___:`", Type: "FILL_BLANK", CorrectAnswer: "try"},
		{TaskID: 22, QuestionText: "Aby złapać konkretny typ wyjątku, np. `ValueError`, używamy `___ ValueError:`", Type: "FILL_BLANK", CorrectAnswer: "except"},
		{TaskID: 22, QuestionText: "Blok kodu, który wykona się zawsze, niezależnie od tego, czy wystąpił wyjątek, to `___:`", Type: "FILL_BLANK", CorrectAnswer: "finally"},
		{TaskID: 22, QuestionText: "Aby rzucić własny wyjątek, używamy słowa kluczowego `___`.", Type: "FILL_BLANK", CorrectAnswer: "raise"},

		// Task 23 (Python HARD QUIZ - List Comprehensions) - 3 pytania
		{TaskID: 23, QuestionText: "Które list comprehension stworzy listę kwadratów liczb od 0 do 4?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["[x*x for x in range(5)]","[x^2 for x in range(4)]","[x**2 for x in range(0, 4)]","[square(x) for x in range(5)]"]`)), CorrectAnswer: "[x*x for x in range(5)]"},
		{TaskID: 23, QuestionText: "Jak stworzyć listę liczb parzystych od 0 do 9 używając list comprehension?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["[x for x in range(10) if x % 2 == 0]","[x if x % 2 == 0 for x in range(10)]","[x for x in range(0, 9, 2)]","[x % 2 == 0 for x in range(10)]"]`)), CorrectAnswer: "[x for x in range(10) if x % 2 == 0]"},
		{TaskID: 23, QuestionText: "Co robi `[x.upper() for x in ['a', 'b', 'c']]`?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["Tworzy listę ['A', 'B', 'C']","Tworzy krotkę ('A', 'B', 'C')","Zwraca błąd","Tworzy listę ['a', 'b', 'c']"]`)), CorrectAnswer: "Tworzy listę ['A', 'B', 'C']"},

		// Task 24 (Go MEDIUM QUIZ - Interfejsy) - 4 pytania
		{TaskID: 24, QuestionText: "Jak definiujemy interfejs `Writer` z metodą `Write` w Go?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["type Writer interface { Write([]byte) (int, error) }","interface Writer { Write(...) }","struct Writer interface { ... }","define Writer { ... }"]`)), CorrectAnswer: "type Writer interface { Write([]byte) (int, error) }"},
		{TaskID: 24, QuestionText: "W Go, implementacja interfejsu jest:", Type: "QUIZ", Options: datatypes.JSON([]byte(`["Jawna (explicit) - trzeba użyć słowa kluczowego 'implements'","Niejawna (implicit) - wystarczy zaimplementować metody","Deklaratywna - trzeba zarejestrować typ","Automatyczna - kompilator sam wykrywa"]`)), CorrectAnswer: "Niejawna (implicit) - wystarczy zaimplementować metody"},
		{TaskID: 24, QuestionText: "Co oznacza pusty interfejs `interface{}` w Go?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["Typ, który nie ma metod","Typ, który może przechowywać wartość dowolnego typu","Błąd kompilacji","Interfejs bez implementacji"]`)), CorrectAnswer: "Typ, który może przechowywać wartość dowolnego typu"},
		{TaskID: 24, QuestionText: "Jak sprawdzić, czy zmienna `v` typu `interface{}` przechowuje wartość typu `string`?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["v.(string)","v as string","type(v) == string","(string)v"]`)), CorrectAnswer: "v.(string)"}, // Type Assertion

		// Task 25 (Go EASY FILL_BLANK - Obsługa Błędów) - 3 pytania
		{TaskID: 25, QuestionText: "Funkcje w Go, które mogą zwrócić błąd, zazwyczaj zwracają wartość błędu jako ___ wartość.", Type: "FILL_BLANK", CorrectAnswer: "ostatnią"}, // last
		{TaskID: 25, QuestionText: "Sprawdź, czy zmienna `err` zawiera błąd: `if err != ___ { ... }`", Type: "FILL_BLANK", CorrectAnswer: "nil"},
		{TaskID: 25, QuestionText: "Aby utworzyć nowy błąd z komunikatem, użyj pakietu `errors` i funkcji: `errors.___(\"komunikat błędu\")`", Type: "FILL_BLANK", CorrectAnswer: "New"},

		// Task 26 (JavaScript MEDIUM QUIZ - DOM Manipulation) - 6 pytań
		{TaskID: 26, QuestionText: "Jak pobrać element HTML o ID 'myElement'?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["document.getElement('myElement')","document.querySelector('#myElement')","document.getElementById('myElement')","Obie odpowiedzi B i C są poprawne"]`)), CorrectAnswer: "Obie odpowiedzi B i C są poprawne"},
		{TaskID: 26, QuestionText: "Jak zmienić tekst wewnątrz elementu `p` na 'Hello World'?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["p.text = 'Hello World'","p.innerHTML = 'Hello World'","p.textContent = 'Hello World'","Obie odpowiedzi B i C są poprawne"]`)), CorrectAnswer: "Obie odpowiedzi B i C są poprawne"},
		{TaskID: 26, QuestionText: "Jak dodać klasę CSS 'active' do elementu `el`?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["el.addClass('active')","el.className += ' active'","el.classList.add('active')","Obie odpowiedzi B i C są poprawne"]`)), CorrectAnswer: "el.classList.add('active')"},
		{TaskID: 26, QuestionText: "Jak stworzyć nowy element `div`?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["document.createElement('div')","new HTMLDivElement()","document.create('div')","document.newElement('div')"]`)), CorrectAnswer: "document.createElement('div')"},
		{TaskID: 26, QuestionText: "Jak dodać nowo stworzony element `newDiv` jako dziecko do elementu `parent`?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["parent.addChild(newDiv)","parent.append(newDiv)","parent.appendChild(newDiv)","Obie odpowiedzi B i C są poprawne"]`)), CorrectAnswer: "Obie odpowiedzi B i C są poprawne"},
		{TaskID: 26, QuestionText: "Jak dodać nasłuchiwanie na kliknięcie do przycisku `btn`?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["btn.onClick = function(){...}","btn.addEventListener('click', function(){...})","Oba powyższe","btn.attachEvent('onclick', function(){...})"]`)), CorrectAnswer: "Oba powyższe"},

		// Task 27 (JavaScript HARD FILL_BLANK - Hoisting) - 5 pytań
		{TaskID: 27, QuestionText: "Deklaracje zmiennych używające `___` są 'wynoszone' (hoisted) na górę zakresu, ale ich inicjalizacja (przypisanie wartości) nie.", Type: "FILL_BLANK", CorrectAnswer: "var"},
		{TaskID: 27, QuestionText: "Deklaracje zmiennych używające `let` i `___` również są hoisted, ale trafiają do 'Temporal Dead Zone' (TDZ) i nie można ich użyć przed deklaracją.", Type: "FILL_BLANK", CorrectAnswer: "const"},
		{TaskID: 27, QuestionText: "Deklaracje funkcji (function declarations: `function foo(){...}`) są hoisted w całości, łącznie z ich ___.", Type: "FILL_BLANK", CorrectAnswer: "ciałem"}, // body / definition
		{TaskID: 27, QuestionText: "Wyrażenia funkcyjne (function expressions: `const bar = function(){...}`) przypisane do zmiennych `var` mają hoisted tylko deklarację ___.", Type: "FILL_BLANK", CorrectAnswer: "zmiennej"}, // variable
		{TaskID: 27, QuestionText: "W trybie `'use ___';` hoisting dla `var` działa tak samo, ale próba użycia niezainicjalizowanej zmiennej rzuci ReferenceError (TDZ).", Type: "FILL_BLANK", CorrectAnswer: "strict"},

		// Task 28 (JavaScript HARD QUIZ - Promises) - 7 pytań
		{TaskID: 28, QuestionText: "Co reprezentuje obiekt Promise w JavaScript?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["Wynik operacji synchronicznej","Zmienną globalną","Zakończenie (lub niepowodzenie) operacji asynchronicznej i jej wynik","Funkcję zwrotną (callback)"]`)), CorrectAnswer: "Zakończenie (lub niepowodzenie) operacji asynchronicznej i jej wynik"},
		{TaskID: 28, QuestionText: "Jakie trzy stany może mieć Promise?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["Pending, Fulfilled, Rejected","Started, Running, Finished","Waiting, Success, Error","New, Active, Done"]`)), CorrectAnswer: "Pending, Fulfilled, Rejected"},
		{TaskID: 28, QuestionText: "Która metoda jest używana do zarejestrowania funkcji zwrotnej, która zostanie wywołana, gdy Promise zakończy się sukcesem (fulfilled)?", Type: "QUIZ", Options: datatypes.JSON([]byte(`[".then()",".catch()",".finally()",".done()"]`)), CorrectAnswer: ".then()"},
		{TaskID: 28, QuestionText: "Która metoda służy do obsługi błędu (rejected state) Promise?", Type: "QUIZ", Options: datatypes.JSON([]byte(`[".then(null, onRejected)",".catch(onRejected)","Oba powyższe",".error(onRejected)"]`)), CorrectAnswer: "Oba powyższe"},
		{TaskID: 28, QuestionText: "Metoda `Promise.all(iterable)` zwraca Promise, który:", Type: "QUIZ", Options: datatypes.JSON([]byte(`["Rozwiązuje się, gdy pierwszy Promise w iterable się rozwiąże","Rozwiązuje się, gdy wszystkie Promises w iterable się rozwiążą","Odrzuca, gdy pierwszy Promise w iterable zostanie odrzucony","Obie odpowiedzi B i C są poprawne"]`)), CorrectAnswer: "Obie odpowiedzi B i C są poprawne"},
		{TaskID: 28, QuestionText: "Metoda `Promise.race(iterable)` zwraca Promise, który:", Type: "QUIZ", Options: datatypes.JSON([]byte(`["Rozwiązuje się lub odrzuca, gdy tylko pierwszy Promise w iterable się rozwiąże lub zostanie odrzucony","Czeka na wszystkie Promises","Ignoruje odrzucone Promises","Zawsze się rozwiązuje"]`)), CorrectAnswer: "Rozwiązuje się lub odrzuca, gdy tylko pierwszy Promise w iterable się rozwiąże lub zostanie odrzucony"},
		{TaskID: 28, QuestionText: "Jak stworzyć nowy Promise, który rozwiązuje się po 1 sekundzie?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["new Promise(resolve => setTimeout(resolve, 1000))","Promise.delay(1000)","setTimeout(1000).then()","async () => await delay(1000)"]`)), CorrectAnswer: "new Promise(resolve => setTimeout(resolve, 1000))"},

		// Task 29 (TypeScript MEDIUM QUIZ - Klasy) - 5 pytań
		{TaskID: 29, QuestionText: "Który modyfikator dostępu sprawia, że składowa klasy jest dostępna tylko wewnątrz tej klasy?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["public","private","protected","internal"]`)), CorrectAnswer: "private"},
		{TaskID: 29, QuestionText: "Który modyfikator dostępu pozwala na dostęp do składowej w klasie dziedziczącej?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["public","private","protected","package"]`)), CorrectAnswer: "protected"},
		{TaskID: 29, QuestionText: "Słowo kluczowe do wskazania, że klasa `Dog` dziedziczy po klasie `Animal`, to:", Type: "QUIZ", Options: datatypes.JSON([]byte(`["inherits","extends","implements","derives"]`)), CorrectAnswer: "extends"},
		{TaskID: 29, QuestionText: "Jak wywołać konstruktor klasy bazowej (nadrzędnej) z konstruktora klasy pochodnej?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["base()","parent()","super()","this()"]`)), CorrectAnswer: "super()"},
		{TaskID: 29, QuestionText: "Co oznacza słowo kluczowe `static` przed metodą lub właściwością klasy?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["Składowa jest stała i nie można jej zmienić","Składowa należy do samej klasy, a nie do instancji obiektu","Metoda jest asynchroniczna","Właściwość jest tylko do odczytu"]`)), CorrectAnswer: "Składowa należy do samej klasy, a nie do instancji obiektu"},

		// Task 30 (TypeScript EASY FILL_BLANK - Enums) - 4 pytania
		{TaskID: 30, QuestionText: "Zdefiniuj enum `Direction` z wartościami North, East, South, West: `___ Direction { North, East, South, West }`", Type: "FILL_BLANK", CorrectAnswer: "enum"},
		{TaskID: 30, QuestionText: "Domyślnie, pierwsza wartość enuma (North) będzie miała przypisaną liczbę ___.", Type: "FILL_BLANK", CorrectAnswer: "0"},
		{TaskID: 30, QuestionText: "Możesz przypisać własne wartości liczbowe: `enum Status { Pending = 1, Approved = ___, Rejected = 5 }`", Type: "FILL_BLANK", CorrectAnswer: "2"}, // Zakładając domyślną inkrementację
		{TaskID: 30, QuestionText: "Możesz też użyć stringów jako wartości enuma: `enum Color { Red = \"RED\", Green = \"___\" }`", Type: "FILL_BLANK", CorrectAnswer: "GREEN"},

		// Task 31 (C# MEDIUM QUIZ - Kolekcje) - 5 pytań
		{TaskID: 31, QuestionText: "Która kolekcja reprezentuje dynamiczną listę obiektów określonego typu?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["Array","List<T>","Dictionary<TKey, TValue>","ArrayList"]`)), CorrectAnswer: "List<T>"},
		{TaskID: 31, QuestionText: "Która kolekcja przechowuje pary klucz-wartość?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["Array","List<T>","Dictionary<TKey, TValue>","HashSet<T>"]`)), CorrectAnswer: "Dictionary<TKey, TValue>"},
		{TaskID: 31, QuestionText: "Jak dodać element do `List<string> names`?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["names.Append(\"Adam\");","names.Push(\"Adam\");","names.Add(\"Adam\");","names.Insert(\"Adam\");"]`)), CorrectAnswer: "names.Add(\"Adam\");"},
		{TaskID: 31, QuestionText: "Jak uzyskać dostęp do wartości w `Dictionary<string, int> ages` dla klucza \"Bob\"?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["ages.Get(\"Bob\")","ages[\"Bob\"]","ages.Value(\"Bob\")","ages.Fetch(\"Bob\")"]`)), CorrectAnswer: "ages[\"Bob\"]"},
		{TaskID: 31, QuestionText: "Która kolekcja NIE pozwala na duplikaty?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["List<T>","Dictionary<TKey, TValue>","HashSet<T>","Queue<T>"]`)), CorrectAnswer: "HashSet<T>"},

		// Task 32 (C# EASY FILL_BLANK - Properties) - 3 pytania
		{TaskID: 32, QuestionText: "Zdefiniuj publiczną właściwość `Name` typu string z akcesorami get i set: `public string Name { ___ ; ___ ; }`", Type: "FILL_BLANK", CorrectAnswer: "get set"}, // Lub "get; set;"
		{TaskID: 32, QuestionText: "Automatycznie implementowana właściwość (auto-property): `public int Age { get; ___ ; }`", Type: "FILL_BLANK", CorrectAnswer: "set"},
		{TaskID: 32, QuestionText: "Właściwość tylko do odczytu (bez set): `public double Pi { get { return 3.14; } ___ }` (wpisz słowo `private` jeśli chcesz prywatny setter)", Type: "FILL_BLANK", CorrectAnswer: ""}, // Pusty string oznacza brak settera

		// Task 33 (C# HARD QUIZ - Async/Await) - 6 pytań
		{TaskID: 33, QuestionText: "Jakie słowo kluczowe oznacza metodę jako asynchroniczną w C#?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["async","await","Task","void"]`)), CorrectAnswer: "async"},
		{TaskID: 33, QuestionText: "Jakie słowo kluczowe jest używane do oczekiwania na zakończenie operacji asynchronicznej?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["async","await","Task","Wait"]`)), CorrectAnswer: "await"},
		{TaskID: 33, QuestionText: "Metoda oznaczona jako `async` musi zwracać:", Type: "QUIZ", Options: datatypes.JSON([]byte(`["void","Task","Task<T>","Jedną z odpowiedzi B lub C"]`)), CorrectAnswer: "Jedną z odpowiedzi B lub C"},
		{TaskID: 33, QuestionText: "Co się stanie, jeśli wywołasz metodę asynchroniczną bez `await`?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["Kod poczeka na jej zakończenie","Otrzymasz błąd kompilacji","Metoda wykona się synchronicznie","Metoda rozpocznie wykonywanie, a kod będzie kontynuowany natychmiast"]`)), CorrectAnswer: "Metoda rozpocznie wykonywanie, a kod będzie kontynuowany natychmiast"},
		{TaskID: 33, QuestionText: "`Task.Run(() => { ... })` służy do:", Type: "QUIZ", Options: datatypes.JSON([]byte(`["Uruchomienia kodu w głównym wątku UI","Uruchomienia kodu synchronicznie","Uruchomienia kodu w wątku z puli wątków (ThreadPool)","Zatrzymania bieżącego zadania"]`)), CorrectAnswer: "Uruchomienia kodu w wątku z puli wątków (ThreadPool)"},
		{TaskID: 33, QuestionText: "Co robi `ConfigureAwait(false)`?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["Przyspiesza wykonanie await","Powoduje, że kontynuacja po await nie musi wracać do oryginalnego kontekstu synchronizacji","Anuluje operację asynchroniczną","Ignoruje wyjątki"]`)), CorrectAnswer: "Powoduje, że kontynuacja po await nie musi wracać do oryginalnego kontekstu synchronizacji"},

		// Task 34 (General EASY QUIZ - HTML) - 5 pytań
		{TaskID: 34, QuestionText: "Który znacznik definiuje nagłówek najwyższego poziomu?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["<header>","<h6>","<h1>","<head>"]`)), CorrectAnswer: "<h1>"},
		{TaskID: 34, QuestionText: "Który znacznik służy do tworzenia akapitu tekstu?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["<p>","<paragraph>","<text>","<div>"]`)), CorrectAnswer: "<p>"},
		{TaskID: 34, QuestionText: "Który znacznik służy do tworzenia linku (hiperłącza)?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["<link>","<a>","<href>","<url>"]`)), CorrectAnswer: "<a>"},
		{TaskID: 34, QuestionText: "Który znacznik służy do wyświetlania obrazka?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["<image>","<picture>","<img>","<src>"]`)), CorrectAnswer: "<img>"},
		{TaskID: 34, QuestionText: "Który znacznik służy do tworzenia nieuporządkowanej listy (punktowanej)?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["<ol>","<ul>","<li>","<list>"]`)), CorrectAnswer: "<ul>"},

		// Task 35 (General EASY FILL_BLANK - CSS) - 5 pytań
		{TaskID: 35, QuestionText: "Aby ustawić kolor tekstu na czerwony: `color: ___;`", Type: "FILL_BLANK", CorrectAnswer: "red"},
		{TaskID: 35, QuestionText: "Aby ustawić rozmiar czcionki na 16 pikseli: `font-size: 16___;`", Type: "FILL_BLANK", CorrectAnswer: "px"},
		{TaskID: 35, QuestionText: "Aby wyśrodkować tekst w elemencie blokowym: `text-align: ___;`", Type: "FILL_BLANK", CorrectAnswer: "center"},
		{TaskID: 35, QuestionText: "Selektor dla wszystkich elementów `p` z klasą `highlight`: `p.___highlight`", Type: "FILL_BLANK", CorrectAnswer: "."},
		{TaskID: 35, QuestionText: "Selektor dla elementu o ID `main-content`: `___main-content`", Type: "FILL_BLANK", CorrectAnswer: "#"},

		// Task 36 (General MEDIUM QUIZ - Singleton) - 4 pytania
		{TaskID: 36, QuestionText: "Głównym celem wzorca Singleton jest:", Type: "QUIZ", Options: datatypes.JSON([]byte(`["Zapewnienie, że klasa ma tylko jedną instancję i zapewnienie globalnego punktu dostępu do niej","Stworzenie wielu instancji obiektu","Ukrycie implementacji klasy","Zezwolenie na dziedziczenie tylko raz"]`)), CorrectAnswer: "Zapewnienie, że klasa ma tylko jedną instancję i zapewnienie globalnego punktu dostępu do niej"},
		{TaskID: 36, QuestionText: "Jak zazwyczaj uzyskuje się dostęp do instancji Singletona?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["Przez publiczny konstruktor","Przez statyczną metodę fabryczną (np. getInstance)","Przez dziedziczenie","Przez wstrzykiwanie zależności"]`)), CorrectAnswer: "Przez statyczną metodę fabryczną (np. getInstance)"},
		{TaskID: 36, QuestionText: "Aby zapobiec tworzeniu wielu instancji, konstruktor klasy Singleton powinien być:", Type: "QUIZ", Options: datatypes.JSON([]byte(`["publiczny","prywatny","chroniony","statyczny"]`)), CorrectAnswer: "prywatny"},
		{TaskID: 36, QuestionText: "Potencjalną wadą wzorca Singleton jest:", Type: "QUIZ", Options: datatypes.JSON([]byte(`["Zwiększona złożoność kodu","Utrudnione testowanie jednostkowe z powodu globalnego stanu","Poprawa wydajności","Wymuszenie hermetyzacji"]`)), CorrectAnswer: "Utrudnione testowanie jednostkowe z powodu globalnego stanu"},

		// Task 37 (Algorithms MEDIUM QUIZ - Rekurencja) - 5 pytań
		{TaskID: 37, QuestionText: "Co to jest rekurencja w programowaniu?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["Użycie pętli for do iteracji","Definiowanie funkcji wewnątrz innej funkcji","Funkcja wywołująca samą siebie","Technika optymalizacji kodu"]`)), CorrectAnswer: "Funkcja wywołująca samą siebie"},
		{TaskID: 37, QuestionText: "Co jest niezbędne, aby funkcja rekurencyjna się zakończyła?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["Przypadek bazowy (base case)","Wywołanie rekurencyjne","Parametr wejściowy","Zwrócenie wartości"]`)), CorrectAnswer: "Przypadek bazowy (base case)"},
		{TaskID: 37, QuestionText: "Co może się stać, jeśli funkcja rekurencyjna nie ma poprawnego przypadku bazowego?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["Funkcja zwróci null","Program się zawiesi","Nieskończona rekurencja (Stack Overflow)","Funkcja wykona się tylko raz"]`)), CorrectAnswer: "Nieskończona rekurencja (Stack Overflow)"},
		{TaskID: 37, QuestionText: "Który problem jest klasycznym przykładem do rozwiązania za pomocą rekurencji?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["Obliczanie silni (factorial)","Sortowanie bąbelkowe","Przeszukiwanie liniowe","Sumowanie elementów tablicy iteracyjnie"]`)), CorrectAnswer: "Obliczanie silni (factorial)"},
		{TaskID: 37, QuestionText: "Rekurencja często prowadzi do kodu, który jest:", Type: "QUIZ", Options: datatypes.JSON([]byte(`["Bardziej wydajny pamięciowo niż iteracja","Zawsze szybszy niż iteracja","Bardziej zwięzły i czytelny dla niektórych problemów","Trudniejszy do debugowania niż iteracja"]`)), CorrectAnswer: "Bardziej zwięzły i czytelny dla niektórych problemów"}, // Może też być trudniejszy do debugowania

		// Task 38 (Algorithms HARD FILL_BLANK - Drzewa Binarne) - 7 pytań
		{TaskID: 38, QuestionText: "Węzeł drzewa binarnego, który nie ma rodzica, to ___.", Type: "FILL_BLANK", CorrectAnswer: "korzeń"}, // root
		{TaskID: 38, QuestionText: "Węzeł drzewa binarnego, który nie ma dzieci, to ___.", Type: "FILL_BLANK", CorrectAnswer: "liść"}, // leaf
		{TaskID: 38, QuestionText: "Maksymalna liczba węzłów na poziomie `L` (gdzie korzeń jest na poziomie 0) w pełnym drzewie binarnym to 2 do potęgi ___.", Type: "FILL_BLANK", CorrectAnswer: "L"},
		{TaskID: 38, QuestionText: "W binarnym drzewie poszukiwań (BST), wszystkie wartości w lewym poddrzewie węzła są ___ niż wartość węzła.", Type: "FILL_BLANK", CorrectAnswer: "mniejsze"}, // smaller / less than
		{TaskID: 38, QuestionText: "W binarnym drzewie poszukiwań (BST), wszystkie wartości w prawym poddrzewie węzła są ___ niż wartość węzła.", Type: "FILL_BLANK", CorrectAnswer: "większe"}, // greater / larger than
		{TaskID: 38, QuestionText: "Przejście drzewa, które odwiedza lewe poddrzewo, korzeń, a potem prawe poddrzewo, to przejście ___.", Type: "FILL_BLANK", CorrectAnswer: "in-order"}, // inorder
		{TaskID: 38, QuestionText: "Wysokość drzewa binarnego to długość najdłuższej ścieżki od ___ do liścia.", Type: "FILL_BLANK", CorrectAnswer: "korzenia"}, // root

		// Task 39 (Algorithms HARD QUIZ - Grafy) - 6 pytań
		{TaskID: 39, QuestionText: "Co składa się na graf w teorii grafów?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["Węzły i Połączenia","Punkty i Linie","Wierzchołki i Krawędzie","Stany i Przejścia"]`)), CorrectAnswer: "Wierzchołki i Krawędzie"},
		{TaskID: 39, QuestionText: "Graf, w którym krawędzie mają określony kierunek, nazywa się grafem ___.", Type: "QUIZ", Options: datatypes.JSON([]byte(`["Nieskierowanym","Skierowanym","Ważonym","Pełnym"]`)), CorrectAnswer: "Skierowanym"},
		{TaskID: 39, QuestionText: "Algorytm przeszukiwania grafu, który eksploruje 'wszerz' poziom po poziomie, to:", Type: "QUIZ", Options: datatypes.JSON([]byte(`["Przeszukiwanie w głąb (DFS)","Przeszukiwanie wszerz (BFS)","Algorytm Dijkstry","Algorytm A*"]`)), CorrectAnswer: "Przeszukiwanie wszerz (BFS)"},
		{TaskID: 39, QuestionText: "Algorytm przeszukiwania grafu, który eksploruje 'w głąb' najpierw jedną ścieżkę do końca, to:", Type: "QUIZ", Options: datatypes.JSON([]byte(`["Przeszukiwanie w głąb (DFS)","Przeszukiwanie wszerz (BFS)","Algorytm Kruskala","Algorytm Prima"]`)), CorrectAnswer: "Przeszukiwanie w głąb (DFS)"},
		{TaskID: 39, QuestionText: "Algorytm Dijkstry służy do znajdowania:", Type: "QUIZ", Options: datatypes.JSON([]byte(`["Najkrótszej ścieżki w grafie ważonym (bez wag ujemnych)","Minimalnego drzewa rozpinającego","Maksymalnego przepływu w sieci","Silnie spójnych składowych"]`)), CorrectAnswer: "Najkrótszej ścieżki w grafie ważonym (bez wag ujemnych)"},
		{TaskID: 39, QuestionText: "Macierz sąsiedztwa (adjacency matrix) grafu o N wierzchołkach ma rozmiar:", Type: "QUIZ", Options: datatypes.JSON([]byte(`["N x 1","1 x N","N x N","Zależny od liczby krawędzi"]`)), CorrectAnswer: "N x N"},

		// Task 40 (General MEDIUM FILL_BLANK - Model OSI) - 7 pytań
		{TaskID: 40, QuestionText: "Warstwa 1 Modelu OSI to warstwa ___.", Type: "FILL_BLANK", CorrectAnswer: "fizyczna"}, // Physical
		{TaskID: 40, QuestionText: "Warstwa 2 Modelu OSI, odpowiedzialna za ramki i adresy MAC, to warstwa ___ danych.", Type: "FILL_BLANK", CorrectAnswer: "łącza"}, // Data Link
		{TaskID: 40, QuestionText: "Warstwa 3 Modelu OSI, odpowiedzialna za routing i adresy IP, to warstwa ___.", Type: "FILL_BLANK", CorrectAnswer: "sieci"}, // Network
		{TaskID: 40, QuestionText: "Warstwa 4 Modelu OSI, zapewniająca niezawodne połączenie (TCP) lub szybkie (UDP), to warstwa ___.", Type: "FILL_BLANK", CorrectAnswer: "transportowa"}, // Transport
		{TaskID: 40, QuestionText: "Warstwa 5 Modelu OSI, zarządzająca sesjami komunikacyjnymi, to warstwa ___.", Type: "FILL_BLANK", CorrectAnswer: "sesji"}, // Session
		{TaskID: 40, QuestionText: "Warstwa 6 Modelu OSI, odpowiedzialna za formatowanie i szyfrowanie danych, to warstwa ___.", Type: "FILL_BLANK", CorrectAnswer: "prezentacji"}, // Presentation
		{TaskID: 40, QuestionText: "Warstwa 7 Modelu OSI, najbliższa użytkownikowi (np. HTTP, FTP, SMTP), to warstwa ___.", Type: "FILL_BLANK", CorrectAnswer: "aplikacji"}, // Application
	}

	for _, q := range questions {
		if err := db.Create(&q).Error; err != nil {
			return err
		}
	}

	// ====================
	// 5. Przykładowy progres
	// ====================
	progress := []models.UserTaskProgress{
		// Alice (ID: 1) rozpoczęła zadanie 1 i 3
		{UserID: 1, TaskID: 1, Progress: 0, Attempts: 0, Mistakes: 0, IsCompleted: false},
		{UserID: 1, TaskID: 3, Progress: 0, Attempts: 0, Mistakes: 0, IsCompleted: false},
		// Bob (ID: 2) rozpoczął zadanie 2
		{UserID: 2, TaskID: 2, Progress: 0, Attempts: 0, Mistakes: 0, IsCompleted: false},
	}
	for _, p := range progress {
		if err := db.Create(&p).Error; err != nil {
			return err
		}
	}
    
    // ... (reszta Twojego kodu, np. friendships) ...
    
	return nil
}