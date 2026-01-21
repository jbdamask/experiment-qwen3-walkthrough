This was an experiment with the Ralph loop to make an app.
I used Ryan Carson's implementation of Ralph, https://github.com/snarktank/ralph

The idea was random - that is, the app doesn't matter. What I wanted to do is see how fast I could build something in and unattended fashion. But the app does work on my Mac. It has a backend runnable via uvicorn and a node frontend.
I won't be working on this app anymore.

In a nutshell, [this](https://github.com/jbdamask/scratch/tree/main/EXPERIMENTS/super-simple-ralph-example) is all Ralph is.
The idea is to start a new Claude session for each feature developed. This gives it a fresh context window, which reduces context rot. The only thing any given loop knows about is it's own work on a task, w whic is similar to how human engineers work. Easy to understand.

According to Geoffrey Huntley, the one who named the pattern, the most important thing for the software engineer is to write good specifications so that there's minimal ambiguity when Claude works on a task. 
This is because you run Claude in YOLO mode so you're not around to answer questions.

A video walkthrough with explaination is [here](https://youtu.be/bB4fOUgkfe8).
