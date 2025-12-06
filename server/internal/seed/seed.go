package seed

import (
	"time"

	"github.com/Suplice/Filestorix/internal/models"
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

func SeedTestData(db *gorm.DB) error {
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

	users := []models.User{
		{Username: "alice", Email: "alice@example.com", Provider: "EMAIL", AvatarURL: "https://i.pravatar.cc/150?img=1", Role: "user", Level: 3, XP: 120, Points: 50, StreakCount: 5, LastActiveDate: time.Now()},
		{Username: "bob", Email: "bob@example.com", Provider: "EMAIL", AvatarURL: "https://i.pravatar.cc/150?img=2", Role: "user", Level: 2, XP: 70, Points: 20, StreakCount: 2, LastActiveDate: time.Now()},
		{Username: "admin", Email: "admin@admin.com", Provider: "EMAIL", AvatarURL: "https://i.pravatar.cc/150?img=3", Role: "admin", PasswordHash: "$2a$10$K1Ap8iJfIq8APieGy5G3qukIAqP6ZfFc16uLxWcBPFf8TBjqzGnAq", Level: 0, XP: 0, Points: 0, StreakCount: 0, LastActiveDate: time.Now()},
	}
	for _, u := range users {
		if err := db.Create(&u).Error; err != nil {
			return err
		}
	}

	tasks := []models.Task{
    {Title: "Python Basics", Description: "Multiple-choice quiz about variables and types.", Type: "QUIZ", Language: "Python", Difficulty: "EASY", Points: 10, XP: 5},                                     
    {Title: "JavaScript - ES6", Description: "Test your knowledge of arrow functions and `let`/`const`.", Type: "QUIZ", Language: "JavaScript", Difficulty: "EASY", Points: 15, XP: 10},       
    {Title: "Declarations in Go", Description: "Fill in the blanks in Go code.", Type: "FILL_BLANK", Language: "Go", Difficulty: "MEDIUM", Points: 20, XP: 15},                                                              
    {Title: "SQL Statements", Description: "Complete popular SQL queries.", Type: "FILL_BLANK", Language: "General", Difficulty: "MEDIUM", Points: 20, XP: 15},                                                              

    {Title: "Python - Loops and Lists", Description: "Quiz regarding for/while loops and list operations.", Type: "QUIZ", Language: "Python", Difficulty: "MEDIUM", Points: 25, XP: 15},            
    {Title: "Python - Functions", Description: "Complete definitions of simple functions in Python.", Type: "FILL_BLANK", Language: "Python", Difficulty: "MEDIUM", Points: 30, XP: 20},             
    {Title: "Python - Classes and Objects", Description: "Quiz on the basics of object-oriented programming in Python.", Type: "QUIZ", Language: "Python", Difficulty: "HARD", Points: 45, XP: 30},        

    {Title: "Go - Structs and Methods", Description: "Quiz on defining structs and methods in Go.", Type: "QUIZ", Language: "Go", Difficulty: "MEDIUM", Points: 30, XP: 20},                 
    {Title: "Go - Goroutines", Description: "Complete the code related to concurrency basics.", Type: "FILL_BLANK", Language: "Go", Difficulty: "HARD", Points: 50, XP: 35},               

    {Title: "JavaScript - Array Operations", Description: "Quiz on array methods like map, filter, reduce.", Type: "QUIZ", Language: "JavaScript", Difficulty: "MEDIUM", Points: 35, XP: 25}, 
    {Title: "JavaScript - Asynchrony", Description: "Complete the code using async/await and Promises.", Type: "FILL_BLANK", Language: "JavaScript", Difficulty: "HARD", Points: 55, XP: 40}, 

    {Title: "TypeScript - Basic Types", Description: "Quiz on basic types and interfaces.", Type: "QUIZ", Language: "TypeScript", Difficulty: "EASY", Points: 15, XP: 10},            
    {Title: "TypeScript - Generics", Description: "Complete the code using generic types.", Type: "FILL_BLANK", Language: "TypeScript", Difficulty: "MEDIUM", Points: 30, XP: 20},          
    {Title: "TypeScript - Advanced Types", Description: "Quiz on union, conditional, and utility types.", Type: "QUIZ", Language: "TypeScript", Difficulty: "HARD", Points: 50, XP: 35}, 

    {Title: "C# - Syntax Basics", Description: "Quiz on variables, types, and conditional statements.", Type: "QUIZ", Language: "C#", Difficulty: "EASY", Points: 10, XP: 5},                  
    {Title: "C# - Classes and Methods", Description: "Complete class and method definitions in C#.", Type: "FILL_BLANK", Language: "C#", Difficulty: "MEDIUM", Points: 25, XP: 15},                  
    {Title: "C# - LINQ", Description: "Quiz on basic LINQ queries.", Type: "QUIZ", Language: "C#", Difficulty: "HARD", Points: 45, XP: 30},                                                               

    {Title: "Algorithms - Big O Notation", Description: "Quiz on the basics of computational complexity.", Type: "QUIZ", Language: "Algorithms", Difficulty: "EASY", Points: 20, XP: 15},             
    {Title: "Algorithms - Sorting", Description: "Fill in the names of popular sorting algorithms.", Type: "FILL_BLANK", Language: "Algorithms", Difficulty: "MEDIUM", Points: 35, XP: 25}, 
    {Title: "Algorithms - Data Structures", Description: "Quiz on stacks, queues, and linked lists.", Type: "QUIZ", Language: "Algorithms", Difficulty: "HARD", Points: 60, XP: 45},     
    {Title: "Python - Dictionaries", Description: "Quiz on creating and modifying dictionaries.", Type: "QUIZ", Language: "Python", Difficulty: "EASY", Points: 15, XP: 10},                                                              
    {Title: "Python - Exception Handling", Description: "Complete try/except blocks.", Type: "FILL_BLANK", Language: "Python", Difficulty: "MEDIUM", Points: 30, XP: 20},                                                                 
    {Title: "Python - List Comprehensions", Description: "Quiz on creating lists in a concise form.", Type: "QUIZ", Language: "Python", Difficulty: "HARD", Points: 50, XP: 35},                                                        

    {Title: "Go - Interfaces", Description: "Quiz on defining and implementing interfaces.", Type: "QUIZ", Language: "Go", Difficulty: "MEDIUM", Points: 35, XP: 25},                                                              
    {Title: "Go - Error Handling", Description: "Complete the typical error handling pattern in Go.", Type: "FILL_BLANK", Language: "Go", Difficulty: "EASY", Points: 15, XP: 10},                                                      

    {Title: "JavaScript - DOM Manipulation", Description: "Quiz on the basics of DOM tree manipulation.", Type: "QUIZ", Language: "JavaScript", Difficulty: "MEDIUM", Points: 30, XP: 20},            
    {Title: "JavaScript - Hoisting", Description: "Fill in the blanks regarding variable and function hoisting.", Type: "FILL_BLANK", Language: "JavaScript", Difficulty: "HARD", Points: 45, XP: 30},      
    {Title: "JavaScript - Promises", Description: "Quiz regarding creating and handling Promises.", Type: "QUIZ", Language: "JavaScript", Difficulty: "HARD", Points: 55, XP: 40},                                                       

    {Title: "TypeScript - Classes", Description: "Quiz on access modifiers and class inheritance.", Type: "QUIZ", Language: "TypeScript", Difficulty: "MEDIUM", Points: 30, XP: 20},            
    {Title: "TypeScript - Enums", Description: "Complete the definitions and usage of enums.", Type: "FILL_BLANK", Language: "TypeScript", Difficulty: "EASY", Points: 15, XP: 10},                                                           

    {Title: "C# - Collections", Description: "Quiz on List<T>, Dictionary<TKey, TValue>.", Type: "QUIZ", Language: "C#", Difficulty: "MEDIUM", Points: 35, XP: 25},                                                                   
    {Title: "C# - Properties", Description: "Complete property definitions (get/set).", Type: "FILL_BLANK", Language: "C#", Difficulty: "EASY", Points: 20, XP: 15},                                                                 
    {Title: "C# - Async/Await", Description: "Quiz on asynchronous programming in C#.", Type: "QUIZ", Language: "C#", Difficulty: "HARD", Points: 60, XP: 45},                                                                
    {Title: "HTML Basics", Description: "Quiz on basic HTML tags.", Type: "QUIZ", Language: "General", Difficulty: "EASY", Points: 10, XP: 5},                                                                                                
    {Title: "CSS Basics", Description: "Complete CSS selectors and properties.", Type: "FILL_BLANK", Language: "General", Difficulty: "EASY", Points: 15, XP: 10},                                                               
    {Title: "Design Patterns - Singleton", Description: "Quiz on the Singleton pattern.", Type: "QUIZ", Language: "General", Difficulty: "MEDIUM", Points: 30, XP: 20},                                                                  
    {Title: "Algorithms - Recursion", Description: "Quiz on the basics of recursion.", Type: "QUIZ", Language: "Algorithms", Difficulty: "MEDIUM", Points: 40, XP: 25},                                                                 
    {Title: "Algorithms - Binary Trees", Description: "Fill in terms related to binary trees.", Type: "FILL_BLANK", Language: "Algorithms", Difficulty: "HARD", Points: 55, XP: 40},       
    {Title: "Algorithms - Graphs", Description: "Quiz on the basics of graph theory and graph algorithms.", Type: "QUIZ", Language: "Algorithms", Difficulty: "HARD", Points: 70, XP: 50},              
    {Title: "Computer Networks - OSI Model", Description: "Fill in the names of the OSI model layers.", Type: "FILL_BLANK", Language: "General", Difficulty: "MEDIUM", Points: 40, XP: 25},                   
}


	if err := db.Create(&tasks).Error; err != nil {
		return err
	}

questions := []models.TaskQuestion{
    {TaskID: 1, QuestionText: "In Python, a variable can change its type during program execution.", Type: "QUIZ", Options: datatypes.JSON([]byte(`["True","False"]`)), CorrectAnswer: "True"},
    {TaskID: 1, QuestionText: "Which of the following is NOT a built-in data type in Python?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["List","Dictionary","Tuple","Array"]`)), CorrectAnswer: "Array"},
    {TaskID: 1, QuestionText: "Which operator checks the type of variable `x`?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["typeof(x)","type(x)","isType(x)","x.type"]`)), CorrectAnswer: "type(x)"},

    {TaskID: 2, QuestionText: "Which keyword allows declaring a variable that cannot be reassigned?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["var","let","const","static"]`)), CorrectAnswer: "const"},
    {TaskID: 2, QuestionText: "Arrow functions `() => {}` do not have their own `this` context.", Type: "QUIZ", Options: datatypes.JSON([]byte(`["True","False"]`)), CorrectAnswer: "True"},

    {TaskID: 3, QuestionText: "In Go, use the `___` operator to declare a new variable with automatic type inference (only inside functions).", Type: "FILL_BLANK", CorrectAnswer: ":="},
    {TaskID: 3, QuestionText: "Declare a constant named `Version` with value 1.1: `___ Version = 1.1`", Type: "FILL_BLANK", CorrectAnswer: "const"},
    {TaskID: 3, QuestionText: "The keyword for importing packages is `___`.", Type: "FILL_BLANK", CorrectAnswer: "import"},

    {TaskID: 4, QuestionText: "To select all columns from the table `users`, type: `SELECT ___ FROM users;`", Type: "FILL_BLANK", CorrectAnswer: "*"},
    {TaskID: 4, QuestionText: "To add a new row to the table `products`, type: `INSERT ___ products (...) VALUES (...);`", Type: "FILL_BLANK", CorrectAnswer: "INTO"},
    {TaskID: 4, QuestionText: "The clause for filtering query results is `___`.", Type: "FILL_BLANK", CorrectAnswer: "WHERE"},


    {TaskID: 5, QuestionText: "Which loop is better when the exact number of iterations is known?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["for","while","do...while","repeat"]`)), CorrectAnswer: "for"},
    {TaskID: 5, QuestionText: "How to add element `5` to the end of list `my_list`?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["my_list.add(5)","my_list.append(5)","my_list.push(5)","my_list.insert(5)"]`)), CorrectAnswer: "my_list.append(5)"},
    {TaskID: 5, QuestionText: "What will `my_list[-1]` return for `my_list = [1, 2, 3]`?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["1","2","3","Error"]`)), CorrectAnswer: "3"},

    {TaskID: 6, QuestionText: "Define a function named `greet` taking one argument `name`: `___ greet(name):`", Type: "FILL_BLANK", CorrectAnswer: "def"},
    {TaskID: 6, QuestionText: "Return the value `result` from a function: `___ result`", Type: "FILL_BLANK", CorrectAnswer: "return"},
    {TaskID: 6, QuestionText: "How to define parameter `age` with a default value of 30? `def person(name, age=___):`", Type: "FILL_BLANK", CorrectAnswer: "30"},

    {TaskID: 7, QuestionText: "What is the name of the special method that initializes a class object in Python?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["__init__","__new__","__create__","__constructor__"]`)), CorrectAnswer: "__init__"},
    {TaskID: 7, QuestionText: "The keyword used to refer to the object instance within a class method is:", Type: "QUIZ", Options: datatypes.JSON([]byte(`["this","object","instance","self"]`)), CorrectAnswer: "self"},
    {TaskID: 7, QuestionText: "What does inheritance mean in object-oriented programming?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["A class can use methods of another class","A class creates instances of another class","A class acquires the properties and methods of another class","A class hides its internal workings"]`)), CorrectAnswer: "A class acquires the properties and methods of another class"},

    {TaskID: 8, QuestionText: "Which keyword is used to define a new struct in Go?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["struct","type","class","define"]`)), CorrectAnswer: "type"},
    {TaskID: 8, QuestionText: "How do you declare a method `Print` for type `*Point`?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["func (p *Point) Print()","func Print(p *Point)","method Print(p *Point)","def (p *Point) Print()"]`)), CorrectAnswer: "func (p *Point) Print()"},
    {TaskID: 8, QuestionText: "Can a struct in Go contain methods?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["Yes, directly inside struct definition","No, methods are separate","Yes, but only as function pointers","Yes, defined outside struct with a receiver"]`)), CorrectAnswer: "Yes, defined outside struct with a receiver"},

    {TaskID: 9, QuestionText: "To run function `myFunc` as a goroutine, write: `___ myFunc()`", Type: "FILL_BLANK", CorrectAnswer: "go"},
    {TaskID: 9, QuestionText: "Declare a channel for type `int`: `myChan := ___ chan int`", Type: "FILL_BLANK", CorrectAnswer: "make"},
    {TaskID: 9, QuestionText: "Send value `10` to channel `ch`: `ch ___ 10`", Type: "FILL_BLANK", CorrectAnswer: "<-"},
    {TaskID: 9, QuestionText: "Receive value from channel `ch` into variable `val`: `val ___ ___ ch`", Type: "FILL_BLANK", CorrectAnswer: ":= <-"},

    {TaskID: 10, QuestionText: "Which method creates a new array with the results of calling a function for every element?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["forEach","map","filter","reduce"]`)), CorrectAnswer: "map"},
    {TaskID: 10, QuestionText: "Which method creates a new array with all elements that pass the test implemented by the provided function?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["forEach","map","filter","reduce"]`)), CorrectAnswer: "filter"},
    {TaskID: 10, QuestionText: "Which method executes a 'reducer' function on each element of the array, resulting in a single output value?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["forEach","map","filter","reduce"]`)), CorrectAnswer: "reduce"},

    {TaskID: 11, QuestionText: "Mark a function as asynchronous with keyword: `___ function myAsyncFunc() { ... }`", Type: "FILL_BLANK", CorrectAnswer: "async"},
    {TaskID: 11, QuestionText: "Wait for a Promise `myPromise` to resolve inside an async function: `const result = ___ myPromise;`", Type: "FILL_BLANK", CorrectAnswer: "await"},
    {TaskID: 11, QuestionText: "Handle errors in an `async/await` block using `___ { ... } catch(err) { ... }`", Type: "FILL_BLANK", CorrectAnswer: "try"},
    {TaskID: 11, QuestionText: "The Promise method to handle successful resolution is `___`.", Type: "FILL_BLANK", CorrectAnswer: ".then()"},

    {TaskID: 12, QuestionText: "How to declare a variable `age` of number type in TypeScript?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["let age: number;","let age = number;","let age: Number;","let age: int;"]`)), CorrectAnswer: "let age: number;"},
    {TaskID: 12, QuestionText: "The keyword to define a custom object shape is:", Type: "QUIZ", Options: datatypes.JSON([]byte(`["type","struct","interface","object"]`)), CorrectAnswer: "interface"},
    {TaskID: 12, QuestionText: "How to define an array of strings `names`?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["let names: string[];","let names: Array<string>;","Both above","None of above"]`)), CorrectAnswer: "Both above"},

    {TaskID: 13, QuestionText: "Define a generic function `identity` that takes an argument of type `T` and returns a value of the same type: `function identity<___>(arg: T): T { return arg; }`", Type: "FILL_BLANK", CorrectAnswer: "T"},
    {TaskID: 13, QuestionText: "Use the generic `Array` type to declare an array of numbers: `let list: Array<___> = [1, 2, 3];`", Type: "FILL_BLANK", CorrectAnswer: "number"},

    {TaskID: 14, QuestionText: "How to define a type `Result` that can be a string OR a number?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["type Result = string | number;","type Result = string & number;","type Result = string or number;","interface Result { string; number; }"]`)), CorrectAnswer: "type Result = string | number;"},
    {TaskID: 14, QuestionText: "Which 'Utility Type' constructs a type with all properties of `T` set to optional?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["Required<T>","Partial<T>","Readonly<T>","Pick<T>"]`)), CorrectAnswer: "Partial<T>"},
    {TaskID: 14, QuestionText: "The `never` type in TypeScript represents:", Type: "QUIZ", Options: datatypes.JSON([]byte(`["Value null or undefined","Value that never occurs","Any type","Unknown type"]`)), CorrectAnswer: "Value that never occurs"},

    {TaskID: 15, QuestionText: "How to declare an integer variable `count` in C#?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["var count;","int count;","integer count;","count: int;"]`)), CorrectAnswer: "int count;"},
    {TaskID: 15, QuestionText: "Which operator is used to compare equality in C#?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["=","==",":=","==="]`)), CorrectAnswer: "=="},
    {TaskID: 15, QuestionText: "How to print 'Hello' to the console?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["print('Hello');","Console.WriteLine(\"Hello\");","echo 'Hello';","System.out.println(\"Hello\");"]`)), CorrectAnswer: "Console.WriteLine(\"Hello\");"},

    {TaskID: 16, QuestionText: "Define a public class named `Person`: `___ class Person { ... }`", Type: "FILL_BLANK", CorrectAnswer: "public"},
    {TaskID: 16, QuestionText: "Declare a public method `Speak` that returns nothing (void): `public ___ Speak() { ... }`", Type: "FILL_BLANK", CorrectAnswer: "void"},
    {TaskID: 16, QuestionText: "Keyword to create a new instance of class `Car`: `Car myCar = ___ Car();`", Type: "FILL_BLANK", CorrectAnswer: "new"},

    {TaskID: 17, QuestionText: "Which LINQ clause is used to filter a collection?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["Select","Where","OrderBy","GroupBy"]`)), CorrectAnswer: "Where"},
    {TaskID: 17, QuestionText: "Which LINQ clause is used to project/transform elements of a collection?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["Select","Where","OrderBy","GroupBy"]`)), CorrectAnswer: "Select"},
    {TaskID: 17, QuestionText: "Which LINQ method returns the first element of a sequence, or a default value if the sequence is empty?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["First()","Single()","FirstOrDefault()","ElementAt(0)"]`)), CorrectAnswer: "FirstOrDefault()"},

    {TaskID: 18, QuestionText: "What does Big O notation describe?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["Exact execution time","Memory complexity","How execution time grows with input size","Number of lines of code"]`)), CorrectAnswer: "How execution time grows with input size"},
    {TaskID: 18, QuestionText: "Which complexity is most efficient (fastest) for large N?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["O(N^2)","O(N log N)","O(N)","O(1)"]`)), CorrectAnswer: "O(1)"},
    {TaskID: 18, QuestionText: "What is the typical time complexity of linear search in an unsorted array?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["O(1)","O(log N)","O(N)","O(N log N)"]`)), CorrectAnswer: "O(N)"},

    {TaskID: 19, QuestionText: "A sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order is ___ sort.", Type: "FILL_BLANK", CorrectAnswer: "bubble"},
    {TaskID: 19, QuestionText: "A divide-and-conquer algorithm that divides the list into halves, recursively sorts them, and then merges them is ___ sort.", Type: "FILL_BLANK", CorrectAnswer: "merge"},
    {TaskID: 19, QuestionText: "A sorting algorithm that picks a 'pivot' element and partitions the array into elements smaller and larger than pivot is ___ sort.", Type: "FILL_BLANK", CorrectAnswer: "quick"},

    {TaskID: 20, QuestionText: "Which data structure follows LIFO (Last-In, First-Out) principle?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["Queue","Stack","Linked List","Binary Tree"]`)), CorrectAnswer: "Stack"},
    {TaskID: 20, QuestionText: "Which data structure follows FIFO (First-In, First-Out) principle?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["Queue","Stack","Linked List","Array"]`)), CorrectAnswer: "Queue"},
    {TaskID: 20, QuestionText: "In which data structure does each element (node) contain a pointer to the next element?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["Array","Stack","Map","Linked List"]`)), CorrectAnswer: "Linked List"},

    {TaskID: 21, QuestionText: "How to create an empty dictionary in Python?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["{}","dict()","Both above","[]"]`)), CorrectAnswer: "Both above"},
    {TaskID: 21, QuestionText: "How to add a key-value pair ('name': 'Alice') to dictionary `d`?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["d.add('name', 'Alice')","d['name'] = 'Alice'","d.insert('name', 'Alice')","d.append({'name': 'Alice'})"]`)), CorrectAnswer: "d['name'] = 'Alice'"},
    {TaskID: 21, QuestionText: "How to check if key 'age' exists in dictionary `d`?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["'age' in d","d.contains('age')","d.has_key('age')","exists(d, 'age')"]`)), CorrectAnswer: "'age' in d"},
    {TaskID: 21, QuestionText: "How to get the value associated with key 'city' in dictionary `d`?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["d.get('city')","d['city']","Both above","d.value('city')"]`)), CorrectAnswer: "Both above"},
    {TaskID: 21, QuestionText: "How to remove a key-value pair with key 'country' from dictionary `d`?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["del d['country']","d.pop('country')","Both above","d.remove('country')"]`)), CorrectAnswer: "Both above"},

    {TaskID: 22, QuestionText: "Code block that might raise an exception is placed inside `___:`", Type: "FILL_BLANK", CorrectAnswer: "try"},
    {TaskID: 22, QuestionText: "To catch a specific exception type, e.g., `ValueError`, use `___ ValueError:`", Type: "FILL_BLANK", CorrectAnswer: "except"},
    {TaskID: 22, QuestionText: "Code block that always executes, regardless of whether an exception occurred, is `___:`", Type: "FILL_BLANK", CorrectAnswer: "finally"},
    {TaskID: 22, QuestionText: "To raise a custom exception manually, use the keyword `___`.", Type: "FILL_BLANK", CorrectAnswer: "raise"},

    {TaskID: 23, QuestionText: "Which list comprehension creates a list of squares for numbers from 0 to 4?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["[x*x for x in range(5)]","[x^2 for x in range(4)]","[x**2 for x in range(0, 4)]","[square(x) for x in range(5)]"]`)), CorrectAnswer: "[x*x for x in range(5)]"},
    {TaskID: 23, QuestionText: "How to create a list of even numbers from 0 to 9 using list comprehension?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["[x for x in range(10) if x % 2 == 0]","[x if x % 2 == 0 for x in range(10)]","[x for x in range(0, 9, 2)]","[x % 2 == 0 for x in range(10)]"]`)), CorrectAnswer: "[x for x in range(10) if x % 2 == 0]"},
    {TaskID: 23, QuestionText: "What does `[x.upper() for x in ['a', 'b', 'c']]` do?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["Creates list ['A', 'B', 'C']","Creates tuple ('A', 'B', 'C')","Returns error","Creates list ['a', 'b', 'c']"]`)), CorrectAnswer: "Creates list ['A', 'B', 'C']"},

    {TaskID: 24, QuestionText: "How to define an interface `Writer` with method `Write` in Go?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["type Writer interface { Write([]byte) (int, error) }","interface Writer { Write(...) }","struct Writer interface { ... }","define Writer { ... }"]`)), CorrectAnswer: "type Writer interface { Write([]byte) (int, error) }"},
    {TaskID: 24, QuestionText: "In Go, interface implementation is:", Type: "QUIZ", Options: datatypes.JSON([]byte(`["Explicit - need 'implements' keyword","Implicit - just implement methods","Declarative - need to register type","Automatic - compiler detects it"]`)), CorrectAnswer: "Implicit - just implement methods"},
    {TaskID: 24, QuestionText: "What does empty interface `interface{}` mean in Go?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["Type with no methods","Type that can hold any value","Compilation error","Interface without implementation"]`)), CorrectAnswer: "Type that can hold any value"},
    {TaskID: 24, QuestionText: "How to check if interface variable `v` holds a `string` value?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["v.(string)","v as string","type(v) == string","(string)v"]`)), CorrectAnswer: "v.(string)"},

    {TaskID: 25, QuestionText: "Functions in Go that can fail usually return the error as the ___ value.", Type: "FILL_BLANK", CorrectAnswer: "last"},
    {TaskID: 25, QuestionText: "Check if variable `err` contains an error: `if err != ___ { ... }`", Type: "FILL_BLANK", CorrectAnswer: "nil"},
    {TaskID: 25, QuestionText: "To create a new error with a message, use package `errors` and function: `errors.___(\"error message\")`", Type: "FILL_BLANK", CorrectAnswer: "New"},

    {TaskID: 26, QuestionText: "How to retrieve an HTML element with ID 'myElement'?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["document.getElement('myElement')","document.querySelector('#myElement')","document.getElementById('myElement')","Both B and C are correct"]`)), CorrectAnswer: "Both B and C are correct"},
    {TaskID: 26, QuestionText: "How to change text inside a `p` element to 'Hello World'?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["p.text = 'Hello World'","p.innerHTML = 'Hello World'","p.textContent = 'Hello World'","Both B and C are correct"]`)), CorrectAnswer: "Both B and C are correct"},
    {TaskID: 26, QuestionText: "How to add CSS class 'active' to element `el`?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["el.addClass('active')","el.className += ' active'","el.classList.add('active')","Both B and C are correct"]`)), CorrectAnswer: "el.classList.add('active')"},
    {TaskID: 26, QuestionText: "How to create a new `div` element?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["document.createElement('div')","new HTMLDivElement()","document.create('div')","document.newElement('div')"]`)), CorrectAnswer: "document.createElement('div')"},
    {TaskID: 26, QuestionText: "How to append newly created element `newDiv` as a child to `parent`?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["parent.addChild(newDiv)","parent.append(newDiv)","parent.appendChild(newDiv)","Both B and C are correct"]`)), CorrectAnswer: "Both B and C are correct"},
    {TaskID: 26, QuestionText: "How to add a click event listener to button `btn`?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["btn.onClick = function(){...}","btn.addEventListener('click', function(){...})","Both above","btn.attachEvent('onclick', function(){...})"]`)), CorrectAnswer: "Both above"},

    {TaskID: 27, QuestionText: "Variable declarations using `___` are hoisted to the top of their scope, but their initialization is not.", Type: "FILL_BLANK", CorrectAnswer: "var"},
    {TaskID: 27, QuestionText: "Variable declarations using `let` and `___` are also hoisted but enter the 'Temporal Dead Zone' (TDZ).", Type: "FILL_BLANK", CorrectAnswer: "const"},
    {TaskID: 27, QuestionText: "Function declarations (`function foo(){...}`) are hoisted completely, including their ___.", Type: "FILL_BLANK", CorrectAnswer: "body"},
    {TaskID: 27, QuestionText: "Function expressions (`const bar = function(){...}`) assigned to `var` variables only have their ___ declaration hoisted.", Type: "FILL_BLANK", CorrectAnswer: "variable"},
    {TaskID: 27, QuestionText: "In `'use ___';` mode, trying to use an undeclared variable throws a ReferenceError.", Type: "FILL_BLANK", CorrectAnswer: "strict"},

    {TaskID: 28, QuestionText: "What does a Promise object represent in JavaScript?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["Result of synchronous operation","Global variable","Completion (or failure) of an asynchronous operation and its resulting value","Callback function"]`)), CorrectAnswer: "Completion (or failure) of an asynchronous operation and its resulting value"},
    {TaskID: 28, QuestionText: "What are the three states of a Promise?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["Pending, Fulfilled, Rejected","Started, Running, Finished","Waiting, Success, Error","New, Active, Done"]`)), CorrectAnswer: "Pending, Fulfilled, Rejected"},
    {TaskID: 28, QuestionText: "Which method is used to register a callback for successful Promise resolution?", Type: "QUIZ", Options: datatypes.JSON([]byte(`[".then()",".catch()",".finally()",".done()"]`)), CorrectAnswer: ".then()"},
    {TaskID: 28, QuestionText: "Which method is used to handle Promise rejection (error)?", Type: "QUIZ", Options: datatypes.JSON([]byte(`[".then(null, onRejected)",".catch(onRejected)","Both above",".error(onRejected)"]`)), CorrectAnswer: "Both above"},
    {TaskID: 28, QuestionText: "`Promise.all(iterable)` returns a Promise that:", Type: "QUIZ", Options: datatypes.JSON([]byte(`["Resolves when first Promise resolves","Resolves when all Promises resolve","Rejects when first Promise rejects","Both B and C are correct"]`)), CorrectAnswer: "Both B and C are correct"},
    {TaskID: 28, QuestionText: "`Promise.race(iterable)` returns a Promise that:", Type: "QUIZ", Options: datatypes.JSON([]byte(`["Resolves or rejects as soon as one of the promises in iterable resolves or rejects","Waits for all Promises","Ignores rejected Promises","Always resolves"]`)), CorrectAnswer: "Resolves or rejects as soon as one of the promises in iterable resolves or rejects"},
    {TaskID: 28, QuestionText: "How to create a new Promise that resolves after 1 second?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["new Promise(resolve => setTimeout(resolve, 1000))","Promise.delay(1000)","setTimeout(1000).then()","async () => await delay(1000)"]`)), CorrectAnswer: "new Promise(resolve => setTimeout(resolve, 1000))"},

    {TaskID: 29, QuestionText: "Which access modifier makes a class member accessible only within that class?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["public","private","protected","internal"]`)), CorrectAnswer: "private"},
    {TaskID: 29, QuestionText: "Which access modifier allows access to a member in derived classes?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["public","private","protected","package"]`)), CorrectAnswer: "protected"},
    {TaskID: 29, QuestionText: "Keyword to indicate that class `Dog` inherits from class `Animal` is:", Type: "QUIZ", Options: datatypes.JSON([]byte(`["inherits","extends","implements","derives"]`)), CorrectAnswer: "extends"},
    {TaskID: 29, QuestionText: "How to call the base class constructor from a derived class constructor?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["base()","parent()","super()","this()"]`)), CorrectAnswer: "super()"},
    {TaskID: 29, QuestionText: "What does the `static` keyword mean before a class method or property?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["Member is constant","Member belongs to the class itself, not instances","Method is asynchronous","Property is read-only"]`)), CorrectAnswer: "Member belongs to the class itself, not instances"},

    {TaskID: 30, QuestionText: "Define an enum `Direction` with values North, East, South, West: `___ Direction { North, East, South, West }`", Type: "FILL_BLANK", CorrectAnswer: "enum"},
    {TaskID: 30, QuestionText: "By default, the first value of an enum (North) will have the numeric value of ___.", Type: "FILL_BLANK", CorrectAnswer: "0"},
    {TaskID: 30, QuestionText: "You can assign custom numeric values: `enum Status { Pending = 1, Approved = ___, Rejected = 5 }`", Type: "FILL_BLANK", CorrectAnswer: "2"},
    {TaskID: 30, QuestionText: "You can also use string values: `enum Color { Red = \"RED\", Green = \"___\" }`", Type: "FILL_BLANK", CorrectAnswer: "GREEN"},

    {TaskID: 31, QuestionText: "Which collection represents a dynamic list of objects of a specific type?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["Array","List<T>","Dictionary<TKey, TValue>","ArrayList"]`)), CorrectAnswer: "List<T>"},
    {TaskID: 31, QuestionText: "Which collection stores key-value pairs?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["Array","List<T>","Dictionary<TKey, TValue>","HashSet<T>"]`)), CorrectAnswer: "Dictionary<TKey, TValue>"},
    {TaskID: 31, QuestionText: "How to add an element to `List<string> names`?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["names.Append(\"Adam\");","names.Push(\"Adam\");","names.Add(\"Adam\");","names.Insert(\"Adam\");"]`)), CorrectAnswer: "names.Add(\"Adam\");"},
    {TaskID: 31, QuestionText: "How to access value in `Dictionary<string, int> ages` for key \"Bob\"?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["ages.Get(\"Bob\")","ages[\"Bob\"]","ages.Value(\"Bob\")","ages.Fetch(\"Bob\")"]`)), CorrectAnswer: "ages[\"Bob\"]"},
    {TaskID: 31, QuestionText: "Which collection does NOT allow duplicates?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["List<T>","Dictionary<TKey, TValue>","HashSet<T>","Queue<T>"]`)), CorrectAnswer: "HashSet<T>"},

    {TaskID: 32, QuestionText: "Define a public string property `Name` with get and set accessors: `public string Name { ___ ; ___ ; }`", Type: "FILL_BLANK", CorrectAnswer: "get set"},
    {TaskID: 32, QuestionText: "Auto-implemented property: `public int Age { get; ___ ; }`", Type: "FILL_BLANK", CorrectAnswer: "set"},
    {TaskID: 32, QuestionText: "Read-only property (no set): `public double Pi { get { return 3.14; } ___ }` (leave blank if no setter)", Type: "FILL_BLANK", CorrectAnswer: ""},

    {TaskID: 33, QuestionText: "Which keyword marks a method as asynchronous in C#?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["async","await","Task","void"]`)), CorrectAnswer: "async"},
    {TaskID: 33, QuestionText: "Which keyword is used to wait for an asynchronous operation to complete?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["async","await","Task","Wait"]`)), CorrectAnswer: "await"},
    {TaskID: 33, QuestionText: "An `async` method should typically return:", Type: "QUIZ", Options: datatypes.JSON([]byte(`["void","Task","Task<T>","Either B or C"]`)), CorrectAnswer: "Either B or C"},
    {TaskID: 33, QuestionText: "What happens if you call an async method without `await`?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["Code waits for it","Compilation error","Runs synchronously","Method starts running, code continues immediately"]`)), CorrectAnswer: "Method starts running, code continues immediately"},
    {TaskID: 33, QuestionText: "`Task.Run(() => { ... })` is used to:", Type: "QUIZ", Options: datatypes.JSON([]byte(`["Run code on UI thread","Run code synchronously","Run code on a ThreadPool thread","Stop current task"]`)), CorrectAnswer: "Run code on a ThreadPool thread"},
    {TaskID: 33, QuestionText: "What does `ConfigureAwait(false)` do?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["Speeds up await","Configures await to not marshal back to original context","Cancels async op","Ignores exceptions"]`)), CorrectAnswer: "Configures await to not marshal back to original context"},

    {TaskID: 34, QuestionText: "Which tag defines the highest level heading?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["<header>","<h6>","<h1>","<head>"]`)), CorrectAnswer: "<h1>"},
    {TaskID: 34, QuestionText: "Which tag defines a paragraph?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["<p>","<paragraph>","<text>","<div>"]`)), CorrectAnswer: "<p>"},
    {TaskID: 34, QuestionText: "Which tag defines a hyperlink?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["<link>","<a>","<href>","<url>"]`)), CorrectAnswer: "<a>"},
    {TaskID: 34, QuestionText: "Which tag defines an image?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["<image>","<picture>","<img>","<src>"]`)), CorrectAnswer: "<img>"},
    {TaskID: 34, QuestionText: "Which tag defines an unordered list?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["<ol>","<ul>","<li>","<list>"]`)), CorrectAnswer: "<ul>"},

    {TaskID: 35, QuestionText: "To set text color to red: `color: ___;`", Type: "FILL_BLANK", CorrectAnswer: "red"},
    {TaskID: 35, QuestionText: "To set font size to 16 pixels: `font-size: 16___;`", Type: "FILL_BLANK", CorrectAnswer: "px"},
    {TaskID: 35, QuestionText: "To center text in a block element: `text-align: ___;`", Type: "FILL_BLANK", CorrectAnswer: "center"},
    {TaskID: 35, QuestionText: "Selector for all `p` elements with class `highlight`: `p.___highlight`", Type: "FILL_BLANK", CorrectAnswer: "."},
    {TaskID: 35, QuestionText: "Selector for element with ID `main-content`: `___main-content`", Type: "FILL_BLANK", CorrectAnswer: "#"},

    {TaskID: 36, QuestionText: "The main purpose of Singleton pattern is:", Type: "QUIZ", Options: datatypes.JSON([]byte(`["Ensure a class has only one instance and provide global access to it","Create multiple instances","Hide implementation","Allow single inheritance"]`)), CorrectAnswer: "Ensure a class has only one instance and provide global access to it"},
    {TaskID: 36, QuestionText: "How is the Singleton instance typically accessed?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["Public constructor","Static factory method (e.g. getInstance)","Inheritance","Dependency Injection"]`)), CorrectAnswer: "Static factory method (e.g. getInstance)"},
    {TaskID: 36, QuestionText: "To prevent creating multiple instances, Singleton constructor should be:", Type: "QUIZ", Options: datatypes.JSON([]byte(`["public","private","protected","static"]`)), CorrectAnswer: "private"},
    {TaskID: 36, QuestionText: "A potential drawback of Singleton is:", Type: "QUIZ", Options: datatypes.JSON([]byte(`["Increased complexity","Harder unit testing due to global state","Improved performance","Enforced encapsulation"]`)), CorrectAnswer: "Harder unit testing due to global state"},

    {TaskID: 37, QuestionText: "What is recursion in programming?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["Using for loops","Defining function inside function","A function calling itself","Optimization technique"]`)), CorrectAnswer: "A function calling itself"},
    {TaskID: 37, QuestionText: "What is necessary for a recursive function to terminate?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["Base case","Recursive call","Input parameter","Return value"]`)), CorrectAnswer: "Base case"},
    {TaskID: 37, QuestionText: "What happens if a recursive function has no base case?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["Returns null","Program freezes","Stack Overflow","Executes once"]`)), CorrectAnswer: "Stack Overflow"},
    {TaskID: 37, QuestionText: "Which problem is a classic example for recursion?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["Factorial calculation","Bubble sort","Linear search","Array summation"]`)), CorrectAnswer: "Factorial calculation"},
    {TaskID: 37, QuestionText: "Recursion often leads to code that is:", Type: "QUIZ", Options: datatypes.JSON([]byte(`["More memory efficient","Always faster","More concise and readable for certain problems","Harder to debug"]`)), CorrectAnswer: "More concise and readable for certain problems"},

    {TaskID: 38, QuestionText: "A node in a binary tree with no parent is called ___.", Type: "FILL_BLANK", CorrectAnswer: "root"},
    {TaskID: 38, QuestionText: "A node in a binary tree with no children is called a ___.", Type: "FILL_BLANK", CorrectAnswer: "leaf"},
    {TaskID: 38, QuestionText: "Max number of nodes at level `L` in a binary tree is 2 to the power of ___.", Type: "FILL_BLANK", CorrectAnswer: "L"},
    {TaskID: 38, QuestionText: "In a Binary Search Tree (BST), all values in the left subtree are ___ than the node's value.", Type: "FILL_BLANK", CorrectAnswer: "smaller"},
    {TaskID: 38, QuestionText: "In a Binary Search Tree (BST), all values in the right subtree are ___ than the node's value.", Type: "FILL_BLANK", CorrectAnswer: "larger"},
    {TaskID: 38, QuestionText: "Tree traversal that visits left subtree, root, then right subtree is ___.", Type: "FILL_BLANK", CorrectAnswer: "in-order"},
    {TaskID: 38, QuestionText: "Height of a binary tree is the length of the longest path from ___ to a leaf.", Type: "FILL_BLANK", CorrectAnswer: "root"},

    {TaskID: 39, QuestionText: "What constitutes a graph?", Type: "QUIZ", Options: datatypes.JSON([]byte(`["Nodes and Connections","Points and Lines","Vertices and Edges","States and Transitions"]`)), CorrectAnswer: "Vertices and Edges"},
    {TaskID: 39, QuestionText: "A graph where edges have a direction is called ___ graph.", Type: "QUIZ", Options: datatypes.JSON([]byte(`["Undirected","Directed","Weighted","Complete"]`)), CorrectAnswer: "Directed"},
    {TaskID: 39, QuestionText: "Graph traversal algorithm that explores level by level is:", Type: "QUIZ", Options: datatypes.JSON([]byte(`["DFS","BFS","Dijkstra","A*"]`)), CorrectAnswer: "BFS"},
    {TaskID: 39, QuestionText: "Graph traversal algorithm that explores as deep as possible along each branch before backtracking is:", Type: "QUIZ", Options: datatypes.JSON([]byte(`["DFS","BFS","Kruskal","Prim"]`)), CorrectAnswer: "DFS"},
    {TaskID: 39, QuestionText: "Dijkstra's algorithm is used for:", Type: "QUIZ", Options: datatypes.JSON([]byte(`["Shortest path in weighted graph (non-negative)","MST","Max flow","Strongly connected components"]`)), CorrectAnswer: "Shortest path in weighted graph (non-negative)"},
    {TaskID: 39, QuestionText: "Adjacency matrix size for a graph with N vertices is:", Type: "QUIZ", Options: datatypes.JSON([]byte(`["N x 1","1 x N","N x N","Depends on edges"]`)), CorrectAnswer: "N x N"},

    {TaskID: 40, QuestionText: "Layer 1 of OSI Model is ___.", Type: "FILL_BLANK", CorrectAnswer: "Physical"},
    {TaskID: 40, QuestionText: "Layer 2 of OSI Model (frames, MAC) is ___ Link.", Type: "FILL_BLANK", CorrectAnswer: "Data"},
    {TaskID: 40, QuestionText: "Layer 3 of OSI Model (routing, IP) is ___.", Type: "FILL_BLANK", CorrectAnswer: "Network"},
    {TaskID: 40, QuestionText: "Layer 4 of OSI Model (TCP, UDP) is ___.", Type: "FILL_BLANK", CorrectAnswer: "Transport"},
    {TaskID: 40, QuestionText: "Layer 5 of OSI Model (sessions) is ___.", Type: "FILL_BLANK", CorrectAnswer: "Session"},
    {TaskID: 40, QuestionText: "Layer 6 of OSI Model (encryption, formatting) is ___.", Type: "FILL_BLANK", CorrectAnswer: "Presentation"},
    {TaskID: 40, QuestionText: "Layer 7 of OSI Model (HTTP, FTP) is ___.", Type: "FILL_BLANK", CorrectAnswer: "Application"},
}

	for _, q := range questions {
		if err := db.Create(&q).Error; err != nil {
			return err
		}
	}

	progress := []models.UserTaskProgress{
		{UserID: 1, TaskID: 1, Progress: 0, Attempts: 0, Mistakes: 0, IsCompleted: false},
		{UserID: 1, TaskID: 3, Progress: 0, Attempts: 0, Mistakes: 0, IsCompleted: false},
		{UserID: 2, TaskID: 2, Progress: 0, Attempts: 0, Mistakes: 0, IsCompleted: false},
	}
	for _, p := range progress {
		if err := db.Create(&p).Error; err != nil {
			return err
		}
	}
    
    
	return nil
}