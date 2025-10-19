let sentence = ["Hello World", "Welcome to JavaScript", "Frontend Mentor Challenges", "I love coding"];
let greetingEl = document.getElementById("greeting");

for(let i = 0; i<sentence.length; i++)
{
    greetingEl.textContent += sentence[i] + " ";
}