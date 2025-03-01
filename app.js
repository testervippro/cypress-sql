async function example() {
    return await fetch("https://jsonplaceholder.typicode.com/todos/1")
        .then(response => response.json());
}



console.log(example() instanceof Promise); 
// Output: true
