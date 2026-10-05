"use strict";

/* ============================================================
 * Pure calculation functions — easy to unit test in isolation.
 * ============================================================ */

function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    if (b === 0) {
        throw new Error("Cannot divide by zero");
    }
    return a / b;
}

/**
 * Apply an operator to two numbers.
 * Kept separate so the UI never needs to know how each operator works.
 */
function operate(operator, a, b) {
    switch (operator) {
        case "+":
            return add(a, b);
        case "-":
            return subtract(a, b);
        case "*":
            return multiply(a, b);
        case "/":
            return divide(a, b);
        default:
            throw new Error("Unknown operator: " + operator);
    }
}

/* ============================================================
 * Browser UI logic — only runs when a DOM is available, so the
 * pure functions above can be imported by Jest without a browser.
 * ============================================================ */

if (typeof document !== "undefined") {
    document.addEventListener("DOMContentLoaded", () => {
        const display = document.getElementById("display");

        let current = "0"; // what the user is currently typing
        let previous = null; // the stored left-hand operand
        let operator = null; // the pending operator
        let justEvaluated = false; // true right after pressing "="

        function updateDisplay() {
            display.textContent = current;
        }

        function inputNumber(value) {
            // Starting fresh after an evaluation or from "0"
            if (justEvaluated) {
                current = "0";
                justEvaluated = false;
            }

            if (value === ".") {
                if (current.includes(".")) {
                    return; // only one decimal point allowed
                }
                current += ".";
                return;
            }

            current = current === "0" ? value : current + value;
        }

        function chooseOperator(nextOperator) {
            // Chain operations: 2 + 3 + -> shows 5, then continues
            if (operator !== null && !justEvaluated) {
                evaluate();
            }
            previous = parseFloat(current);
            operator = nextOperator;
            justEvaluated = false;
            current = "0";
        }

        function evaluate() {
            if (operator === null || previous === null) {
                return;
            }

            const b = parseFloat(current);
            try {
                const result = operate(operator, previous, b);
                current = String(result);
            } catch (error) {
                current = "Error";
            }

            operator = null;
            previous = null;
            justEvaluated = true;
        }

        function clearAll() {
            current = "0";
            previous = null;
            operator = null;
            justEvaluated = false;
        }

        function deleteLast() {
            if (justEvaluated || current === "Error") {
                clearAll();
                return;
            }
            current = current.length > 1 ? current.slice(0, -1) : "0";
        }

        // Recover gracefully if the user keeps typing after an error
        function ensureUsable() {
            if (current === "Error") {
                current = "0";
            }
        }

        // Wire up button clicks
        document.querySelectorAll(".btn").forEach((button) => {
            button.addEventListener("click", () => {
                if (button.dataset.number !== undefined) {
                    ensureUsable();
                    inputNumber(button.dataset.number);
                } else if (button.dataset.operator !== undefined) {
                    ensureUsable();
                    chooseOperator(button.dataset.operator);
                } else if (button.dataset.action === "equals") {
                    evaluate();
                } else if (button.dataset.action === "clear") {
                    clearAll();
                } else if (button.dataset.action === "delete") {
                    deleteLast();
                }
                updateDisplay();
            });
        });

        // Keyboard support
        document.addEventListener("keydown", (event) => {
            const key = event.key;

            if ((key >= "0" && key <= "9") || key === ".") {
                ensureUsable();
                inputNumber(key);
            } else if (["+", "-", "*", "/"].includes(key)) {
                ensureUsable();
                chooseOperator(key);
            } else if (key === "Enter" || key === "=") {
                event.preventDefault();
                evaluate();
            } else if (key === "Backspace") {
                deleteLast();
            } else if (key === "Escape") {
                clearAll();
            } else {
                return; // ignore other keys
            }
            updateDisplay();
        });

        updateDisplay();
    });
}

/* ============================================================
 * Export pure functions for Jest (Node/CommonJS). This block is
 * ignored by browsers, which have no `module` object.
 * ============================================================ */

if (typeof module !== "undefined" && module.exports) {
    module.exports = { add, subtract, multiply, divide, operate };
}
