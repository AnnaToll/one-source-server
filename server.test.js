// Testing Jest

const testFunction = (a, b) => {
    return a * b
}

test('Multiplies two arguments', () => {
    expect(testFunction(2, 3)).toBe(6)
})