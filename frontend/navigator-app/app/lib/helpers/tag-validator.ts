export let invalidChars = "<>\'\"@%&{}[]=";

export function isInvalid(text: String) {
    var alphabetRegExp = /[a-zA-Z]/g;

    let containsInvalid = false;
    let containsAlphabet = false;
    for (let i = 0; i < text.length; i++) {
        containsInvalid = containsInvalid || (invalidChars.indexOf(text[i]) > -1);
        containsAlphabet = containsAlphabet || alphabetRegExp.test(text[i]);
    }

    return (containsInvalid || !containsAlphabet);
}

export function checkNameValidity(name: string) {
    if (name.length < 2 || isInvalid(name)) {
        const response = `Invalid name: ${name}. Please exclude these characters: ${invalidChars} +. Name must contain one alphabet at least.`;
        return [false, response];
    }
    else {
        return [true, ""];
    }
}