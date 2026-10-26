/**
 * PlacedOrPanic - Comprehensive MCQ Question Bank
 * Contains authentic placement exam questions across 4 required topics:
 * 1. General Aptitude
 * 2. Basic C Programming
 * 3. Computer Fundamentals
 * 4. Web Basics
 */

const QUIZ_TOPICS = {
  aptitude: {
    id: "aptitude",
    name: "General Aptitude",
    icon: "🧮",
    description: "Quantitative arithmetic, speed-time-distance, percentages, probability, and logical reasoning puzzles.",
    durationMinutes: 10,
    passingScore: 70,
    accentColor: "#f59e0b",
    questions: [
      {
        id: "apt-1",
        question: "A train running at 72 km/hr crosses an electric pole in 9 seconds. What is the length of the train in meters?",
        options: [
          "150 meters",
          "180 meters",
          "120 meters",
          "200 meters"
        ],
        correctIndex: 1,
        explanation: "Speed = 72 km/hr = 72 * (5/18) = 20 m/s. Distance (Length of train) = Speed * Time = 20 * 9 = 180 meters."
      },
      {
        id: "apt-2",
        question: "If A can complete a work in 12 days and B can do it in 24 days, in how many days can they complete the work working together?",
        options: [
          "6 days",
          "8 days",
          "10 days",
          "16 days"
        ],
        correctIndex: 1,
        explanation: "Combined rate = (1/12) + (1/24) = (2 + 1)/24 = 3/24 = 1/8. Therefore, together they take 8 days."
      },
      {
        id: "apt-3",
        question: "A shopkeeper marks an item 25% above cost price and allows a discount of 10%. Find the profit percentage.",
        options: [
          "12.5%",
          "15%",
          "10%",
          "17.5%"
        ],
        correctIndex: 0,
        explanation: "Let CP = 100. MP = 125. SP after 10% discount = 125 - 12.5 = 112.5. Profit = 112.5 - 100 = 12.5%."
      },
      {
        id: "apt-4",
        question: "Two cards are drawn simultaneously from a well-shuffled pack of 52 cards. What is the probability that both are kings?",
        options: [
          "1 / 169",
          "1 / 221",
          "4 / 663",
          "2 / 13"
        ],
        correctIndex: 1,
        explanation: "Probability = (4/52) * (3/51) = (1/13) * (1/17) = 1/221."
      },
      {
        id: "apt-5",
        question: "Find the missing number in the sequence: 4, 9, 25, 49, 121, ___",
        options: [
          "144",
          "169",
          "196",
          "225"
        ],
        correctIndex: 1,
        explanation: "The terms are squares of consecutive prime numbers: 2²=4, 3²=9, 5²=25, 7²=49, 11²=121, and the next prime is 13, so 13²=169."
      },
      {
        id: "apt-6",
        question: "A man buys an article for ₹800 and sells it at a loss of 20%. What was the selling price?",
        options: [
          "₹640",
          "₹600",
          "₹680",
          "₹720"
        ],
        correctIndex: 0,
        explanation: "Selling Price = 800 - (0.20 * 800) = 800 - 160 = ₹640."
      },
      {
        id: "apt-7",
        question: "In how many distinct ways can the letters of the word 'CAMPUS' be arranged?",
        options: [
          "120",
          "5040",
          "720",
          "360"
        ],
        correctIndex: 2,
        explanation: "'CAMPUS' has 6 distinct letters. Number of permutations = 6! = 6 * 5 * 4 * 3 * 2 * 1 = 720."
      },
      {
        id: "apt-8",
        question: "The average age of 24 students and the class teacher is 16 years. If the teacher's age is excluded, the average reduces by 1 year. What is the teacher's age?",
        options: [
          "38 years",
          "40 years",
          "42 years",
          "36 years"
        ],
        correctIndex: 1,
        explanation: "Total age of 25 people = 25 * 16 = 400. Total age of 24 students = 24 * 15 = 360. Teacher's age = 400 - 360 = 40 years."
      }
    ]
  },

  c_programming: {
    id: "c_programming",
    name: "Basic C Programming",
    icon: "💻",
    description: "Pointers, memory management, recursion, operators, preprocessor directives, and arrays.",
    durationMinutes: 10,
    passingScore: 70,
    accentColor: "#3b82f6",
    questions: [
      {
        id: "c-1",
        question: "What will be the output of the following C code?",
        codeSnippet: `#include <stdio.h>
int main() {
    int arr[] = {10, 20, 30, 40};
    int *ptr = arr;
    printf("%d", *(ptr + 2));
    return 0;
}`,
        options: [
          "10",
          "20",
          "30",
          "Garbage value"
        ],
        correctIndex: 2,
        explanation: "arr decays to a pointer to the first element. *(ptr + 2) accesses the element at index 2, which is 30."
      },
      {
        id: "c-2",
        question: "Which of the following functions is used to deallocate dynamically allocated memory in C?",
        options: [
          "delete()",
          "remove()",
          "free()",
          "release()"
        ],
        correctIndex: 2,
        explanation: "In C, free(ptr) is used to release memory previously allocated by malloc(), calloc(), or realloc()."
      },
      {
        id: "c-3",
        question: "What is the result of sizeof(void*) on a standard 64-bit architecture?",
        options: [
          "2 bytes",
          "4 bytes",
          "8 bytes",
          "Depends on compiler optimization"
        ],
        correctIndex: 2,
        explanation: "On a 64-bit machine, any memory address pointer occupies 8 bytes (64 bits)."
      },
      {
        id: "c-4",
        question: "What is the output of the following program?",
        codeSnippet: `#include <stdio.h>
int main() {
    int x = 5;
    printf("%d %d", x++, ++x);
    return 0;
}`,
        options: [
          "5 7",
          "6 7",
          "Undefined Behavior (Sequence Point violation)",
          "5 6"
        ],
        correctIndex: 2,
        explanation: "Modifying a variable multiple times or reading and writing it without an intervening sequence point produces undefined behavior in standard C."
      },
      {
        id: "c-5",
        question: "Which keyword in C is used to prevent any modification to a variable?",
        options: [
          "static",
          "volatile",
          "immutable",
          "const"
        ],
        correctIndex: 3,
        explanation: "The 'const' qualifier makes a variable read-only after initialization."
      },
      {
        id: "c-6",
        question: "What does the following recursive function return for fun(4)?",
        codeSnippet: `int fun(int n) {
    if (n <= 1) return 1;
    return n * fun(n - 1);
}`,
        options: [
          "12",
          "24",
          "16",
          "4"
        ],
        correctIndex: 1,
        explanation: "fun(4) calculates 4! = 4 * 3 * 2 * 1 = 24."
      },
      {
        id: "c-7",
        question: "Which format specifier is used to print the address of a pointer in printf?",
        options: [
          "%u",
          "%x",
          "%p",
          "%a"
        ],
        correctIndex: 2,
        explanation: "%p is the standard C format specifier designed to display void* pointer addresses."
      },
      {
        id: "c-8",
        question: "What happens when an array index out of bounds is accessed in C?",
        options: [
          "Compilation error",
          "IndexOutOfBoundsException is thrown",
          "Undefined behavior (possible Segmentation Fault or silent memory corruption)",
          "The program safely returns 0"
        ],
        correctIndex: 2,
        explanation: "C does not perform runtime bounds checking; accessing out of bounds causes undefined behavior."
      }
    ]
  },

  computer_fundamentals: {
    id: "computer_fundamentals",
    name: "Computer Fundamentals",
    icon: "🖥️",
    description: "Operating Systems, Computer Networks (OSI layers), DBMS ACID properties, and Computer Architecture.",
    durationMinutes: 10,
    passingScore: 70,
    accentColor: "#10b981",
    questions: [
      {
        id: "cf-1",
        question: "Which layer of the OSI model is responsible for end-to-end reliable transmission, flow control, and error recovery?",
        options: [
          "Data Link Layer",
          "Network Layer",
          "Transport Layer",
          "Session Layer"
        ],
        correctIndex: 2,
        explanation: "The Transport Layer (Layer 4, e.g., TCP) ensures reliable, segmented, end-to-end data delivery."
      },
      {
        id: "cf-2",
        question: "Which of the following is NOT one of the 4 Coffman conditions required for a deadlock to occur in an Operating System?",
        options: [
          "Mutual Exclusion",
          "Hold and Wait",
          "Preemption",
          "Circular Wait"
        ],
        correctIndex: 2,
        explanation: "The 4 conditions are Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait. 'Preemption' prevents deadlock; 'No preemption' is the requirement."
      },
      {
        id: "cf-3",
        question: "In database systems, what does the 'I' in ACID properties stand for?",
        options: [
          "Integrity",
          "Isolation",
          "Indexability",
          "Immutability"
        ],
        correctIndex: 1,
        explanation: "ACID stands for Atomicity, Consistency, Isolation, and Durability."
      },
      {
        id: "cf-4",
        question: "What is the primary role of the CPU Program Counter (PC)?",
        options: [
          "To count the number of instructions executed so far",
          "To store the memory address of the next instruction to be fetched",
          "To store the result of the Arithmetic Logic Unit (ALU)",
          "To control the clock cycle frequency"
        ],
        correctIndex: 1,
        explanation: "The Program Counter (PC) holds the memory address of the next machine instruction to be fetched and executed."
      },
      {
        id: "cf-5",
        question: "Which CPU scheduling algorithm can lead to starvation if short jobs arrive continuously?",
        options: [
          "First-Come, First-Served (FCFS)",
          "Round Robin (RR)",
          "Shortest Job First (SJF / SRTF)",
          "Priority Scheduling with Aging"
        ],
        correctIndex: 2,
        explanation: "In Shortest Job First (SJF), longer processes may starve if smaller tasks constantly enter the ready queue."
      },
      {
        id: "cf-6",
        question: "What is the default port number used by secure HTTPS traffic?",
        options: [
          "80",
          "21",
          "443",
          "8080"
        ],
        correctIndex: 2,
        explanation: "HTTP uses port 80; HTTPS (HTTP over TLS/SSL) uses default TCP port 443."
      },
      {
        id: "cf-7",
        question: "Which memory is the fastest in a computer memory hierarchy?",
        options: [
          "SRAM Cache",
          "DRAM Main Memory",
          "CPU Registers",
          "NVMe Solid State Drive"
        ],
        correctIndex: 2,
        explanation: "Registers located directly inside the CPU execution core have the lowest latency (typically sub-nanosecond)."
      },
      {
        id: "cf-8",
        question: "What phenomenon occurs when excessive paging activity causes the operating system to spend more time swapping than executing instructions?",
        options: [
          "Starvation",
          "Thrashing",
          "Belady's Anomaly",
          "Segmentation Fault"
        ],
        correctIndex: 1,
        explanation: "Thrashing occurs when the system lacks sufficient physical frames, causing constant page faults."
      }
    ]
  },

  web_basics: {
    id: "web_basics",
    name: "Web Basics",
    icon: "🌐",
    description: "HTML5 semantic markup, CSS Box Model & Flexbox, JavaScript event loop, and REST HTTP status codes.",
    durationMinutes: 10,
    passingScore: 70,
    accentColor: "#6366f1",
    questions: [
      {
        id: "wb-1",
        question: "In the CSS Box Model, which property defines the space between the element's border and its content?",
        options: [
          "margin",
          "padding",
          "outline",
          "gap"
        ],
        correctIndex: 1,
        explanation: "Padding is the space between the content and the border. Margin is the outer space around the border."
      },
      {
        id: "wb-2",
        question: "What is the HTTP status code returned when a client requests a resource that requires authentication, but credentials are missing or invalid?",
        options: [
          "400 Bad Request",
          "401 Unauthorized",
          "403 Forbidden",
          "404 Not Found"
        ],
        correctIndex: 1,
        explanation: "HTTP 401 Unauthorized indicates that the request requires user authentication."
      },
      {
        id: "wb-3",
        question: "What is the output of the following JavaScript snippet?",
        codeSnippet: `console.log(typeof NaN);
console.log(NaN === NaN);`,
        options: [
          "'undefined' and true",
          "'number' and false",
          "'object' and true",
          "'NaN' and false"
        ],
        correctIndex: 1,
        explanation: "In JavaScript, typeof NaN is 'number', and NaN is the only value in JS that is not equal to itself (NaN === NaN evaluates to false)."
      },
      {
        id: "wb-4",
        question: "Which of the following functions schedules a callback in the JavaScript Microtask Queue rather than the Macrotask Queue?",
        options: [
          "setTimeout()",
          "setInterval()",
          "Promise.resolve().then()",
          "requestAnimationFrame()"
        ],
        correctIndex: 2,
        explanation: "Promise resolutions and MutationObserver callbacks run in the Microtask Queue, which drains before next macrotasks (e.g. setTimeout)."
      },
      {
        id: "wb-5",
        question: "Which HTML5 semantic element should represent standalone, self-contained content that could be independently distributable?",
        options: [
          "<section>",
          "<article>",
          "<aside>",
          "<div>"
        ],
        correctIndex: 1,
        explanation: "<article> specifies independent, self-contained content such as a blog post or news story."
      },
      {
        id: "wb-6",
        question: "What does the CSS property 'box-sizing: border-box' ensure?",
        options: [
          "The border color is inherited from text color",
          "Padding and border are included in the element's total width and height",
          "Margins collapse automatically",
          "The element is treated as an inline block"
        ],
        correctIndex: 1,
        explanation: "With border-box, the width and height properties include content, padding, and borders."
      },
      {
        id: "wb-7",
        question: "In modern JavaScript, what does Object.freeze() accomplish?",
        options: [
          "Prevents adding new properties, but existing values can still be edited",
          "Deeply freezes all nested objects recursively",
          "Shallowly prevents adding, removing, or modifying properties of an object",
          "Converts the object to a JSON string"
        ],
        correctIndex: 2,
        explanation: "Object.freeze() performs a shallow freeze preventing property additions, deletions, or modifications."
      },
      {
        id: "wb-8",
        question: "Which storage mechanism stores data with NO expiration date and persists even after closing and reopening the browser?",
        options: [
          "sessionStorage",
          "localStorage",
          "HTTP Session Cookie (without Expires header)",
          "Cache-Control: no-cache"
        ],
        correctIndex: 1,
        explanation: "localStorage persists indefinitely until cleared via JavaScript or user manual browser wipe."
      }
    ]
  }
};
