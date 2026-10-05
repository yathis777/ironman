"use strict";

const { add, subtract, multiply, divide, operate } = require("../calculator");

describe("add", () => {
    test("adds two positive numbers", () => {
        expect(add(10, 5)).toBe(15);
    });

    test("adds negative numbers", () => {
        expect(add(-4, -6)).toBe(-10);
    });

    test("adds decimals", () => {
        expect(add(0.1, 0.2)).toBeCloseTo(0.3);
    });
});

describe("subtract", () => {
    test("subtracts two numbers", () => {
        expect(subtract(10, 4)).toBe(6);
    });

    test("handles negative results", () => {
        expect(subtract(4, 10)).toBe(-6);
    });

    test("subtracts decimals", () => {
        expect(subtract(5.5, 2.2)).toBeCloseTo(3.3);
    });
});

describe("multiply", () => {
    test("multiplies two numbers", () => {
        expect(multiply(4, 3)).toBe(12);
    });

    test("multiplies by zero", () => {
        expect(multiply(9, 0)).toBe(0);
    });

    test("multiplies negatives", () => {
        expect(multiply(-3, -3)).toBe(9);
    });

    test("multiplies decimals", () => {
        expect(multiply(1.5, 2)).toBeCloseTo(3);
    });
});

describe("divide", () => {
    test("divides two numbers", () => {
        expect(divide(10, 2)).toBe(5);
    });

    test("divides decimals", () => {
        expect(divide(7.5, 2.5)).toBeCloseTo(3);
    });

    test("divides negative numbers", () => {
        expect(divide(-20, 4)).toBe(-5);
    });

    test("throws on division by zero", () => {
        expect(() => divide(1, 0)).toThrow("Cannot divide by zero");
    });
});

describe("operate", () => {
    test("routes to the correct operation", () => {
        expect(operate("+", 2, 3)).toBe(5);
        expect(operate("-", 9, 4)).toBe(5);
        expect(operate("*", 6, 7)).toBe(42);
        expect(operate("/", 8, 2)).toBe(4);
    });

    test("throws on an unknown operator", () => {
        expect(() => operate("%", 5, 2)).toThrow("Unknown operator: %");
    });
});
