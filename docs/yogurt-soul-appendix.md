# Yogurt Soul Appendix

This document preserves the source trail behind the Yogurt doctrine.

It is intentionally more raw than [yogurt-soul.md](./yogurt-soul.md). Treat this as internal strategy material: owner context, working notes, transcript evidence, and distilled takeaways from adjacent products.

## How To Use This Appendix

- Use `yogurt-soul.md` as the primary north-star document.
- Use this appendix when you need the original reasoning behind the doctrine.
- Do not treat every idea here as a roadmap commitment.
- Do treat recurring themes here as product truth about what Yogurt is trying to become.

## Project Owner Context Dump

Preserved from the March 21, 2026 strategy note, lightly formatted for readability.

### Working Thesis

The project is not trying to build a prettier meeting notepad.

The project is trying to build an extended version of Granola: a Granola-shaped work app where the context layer already exists and can be used to power much more of the workday.

The product vision is:

- meeting note taking
- chatting with teammates
- chatting with external people
- writing docs
- managing the project
- later, email and other work surfaces

Everything should happen inside the same app because all of that context compounds. If meetings, chats, docs, wiki, and decisions live together, AI can perform much better and can help with:

- sales pipeline work
- CRM workflows
- project management
- writing and synthesis
- preparation and follow-up

The reference model is "Lark, but in a Granola way":

- unified work surface
- AI-native from day one
- context-rich
- privacy-sensitive
- human-in-control

### What The Owner Wants Future Contributors To Internalize

- Yogurt is the place where work should happen, not a sidecar note app.
- The product should be architected around context centralization.
- When features are added, the question is not only "does this feature look good?" but "does this bring more work into the same context graph?"
- Frontend, backend, and architecture should all reinforce the same thesis.

### Why Granola Matters

Granola today is already strong because it:

- runs locally
- captures computer audio without a visible bot
- lets users jot rough notes
- enhances them with AI
- supports cross-meeting chat and templates

But the owner's view is that Granola is still too narrow. It should become the place where a team gets work done, not only the place where meetings get recorded.

### What Users Want Granola To Become

Owner-supplied market framing and user demand themes:

- more one-click integrations and automations
- deeper Slack, Notion, CRM, Jira, email, and calendar workflows
- faster proactive agents
- better cross-meeting synthesis
- stronger team memory
- full mobile coverage
- API and enterprise readiness
- keep the simple, private, human-in-control product feel

### What Yogurt Should Do Differently

The owner's working belief is that Yogurt should treat Granola as:

- the wedge
- the data source
- the initial product pattern

but not the final product boundary.

The final product boundary is the work system itself.

## Owner Notes On The Lark Model

The owner's lived experience with Lark was central to the Yogurt thesis.

Key observations:

- Lark felt like an actual app for work.
- Email, chats, docs, meetings, boards, and other workflows lived in one place.
- The experience could be overwhelming, but it made the value of centralization obvious.
- Once all work surfaces lived in one app, it became natural to imagine one AI layer over all of them.

The owner's conclusion:

> There has to be a single chat box where I ask something and it can call everything: docs, chat, meetings, and whatever else explains the work.

That was the moment the Yogurt thesis crystallized.

## Project Owner Examples Of How Granola Was Used As A Work App

These are the strongest examples from the owner note and founder transcript.

### 1. Website copy and ICP selection from 50 sales conversations

Granola was used to synthesize many calls into one product focus:

- there were many candidate use cases
- the owner used Granola chat to identify the one strongest problem
- the result was a focused positioning direction that shaped website copy and messaging

The value was not the transcript alone. The value was the ability to reason across many conversations and ask for the most important strategic conclusion.

### 2. Turning conversations into a PRD and contract path

The owner used Granola across:

- founder conversations
- in-person phone recordings
- folders of related context

The goal was to turn those conversations into PRD-like output and eventually support a contract and product handoff.

The missing step was obvious:

> If there had been one button to turn all this context into a PRD, it would have saved a huge amount of work.

### 3. Importing external context when Granola did not own the full system

When chat or email context lived outside Granola, the owner exported and re-imported it:

- PDFs
- markdown files
- CSVs
- copied Slack threads
- monologues that summarized missing context

This was an improvised attempt to turn Granola into the central context layer even before the product fully supported that mode of use.

### 4. Using monologues as work-context capture

The owner often used quick notes and monologues not as meeting records, but as context injection:

- summarize a Slack debate
- explain the state of a project
- record a decision that happened outside a call
- preserve context for future AI chat

This is important because it shows Yogurt should not define "meeting context" too literally. The user is trying to centralize the context of work, whether it came from a formal meeting or not.

## Sentra Founder Transcript

Below is the preserved transcript that most directly influenced the doctrine. It is included because it captures a strong adjacent framing: organizational memory, interactions as raw data, and the idea that most company truth already exists in meetings, Slack, and email.

### Meeting

- Title: Exploring AI-powered meeting and work context tools with Centra founder
- Date: Mar 2

### Transcript

Them: Had a bunch of companies, like a whole bunch of areas. More recently, I've been sort of obsessed with. So one of the works that I've started this whole agentic approaches. Started from this is called reflection back in 2023. Then. Since then I've been thinking about memory a lot and the thesis that I'm going with right now, and we've been working on it for a while now and it never made sense to me why what memory meant until about a year ago when me and a couple of my students basically realized that pretty much everything in an organization that happens in a company happens because of interactions. So, like, all the conversations and everything that happens in a company basically sort of like, if you can understand all of that, link it to stuff that is happening, then you get a full picture of what is happening in a company. So part of that is meetings, part of that is like Slack, part of that is emails. But that's about it. That covers a large portion of it. So essentially what we are building at Central is essentially all of that to make sense of it.

Me: It's amazing that how they can actually produce notes with that really shitty transcript.

Them: But it doesn't come as that much of a surprise because LLM is taking a lot of heavy lift. Because when you look at the conversation, right, like, the information is present in multiple places. But if you want to build on top of it, if you want to build decisions and build these kinds of places, then the quality needs to be much higher.

Me: I worked with a Chinese team, and the Chinese team didn't have Google, email, anything. They used something called Lark. Lark is a Chinese productivity super app. It has everything. Email, chat, meetings, meeting notes, boards, culture tools, everything. I was the only non-Chinese speaker and I had to understand what was going on across the team. That app made it obvious that there should be a single chat box where I can ask something and it should call everything: docs, Slack-like conversation, all of it.

Me: Later, with Granola, if I had context from outside, like conversation reports or something that happened outside Granola, I exported it in some format and added it into a folder, then connected it and started asking questions. I work mostly in sales and contracts. That was my workflow.

Them: What do you see as the most powerful part of MCP and where do you think it is lacking?

Me: I think it's still broken. Granola chat has system prompts and other understanding that MCP does not serve. MCP just gives me a transcript. It doesn't give me the whole thing that makes Granola chat feel useful.

Me: The Lark experience mattered because when you see all the data in one Mac app for the first time, it completely makes sense. It's probably a little too much, but having an AI on top of it and mapping everything - what happened, how it happened, why it happened - felt super helpful.

Them: But how do you actually use Granola in sales?

Me: For one startup, we had around 50 calls and needed to understand our ICP and the one single problem we should focus on. Granola chat helped surface that the real focus should be AI cart recovery. That shaped the website copy and the rest of the story.

Me: Another example was building a product for Fourthwall. A lot of the contract and PRD logic came from conversations with one of the founders. I recorded in-person chats, put them in Granola, and used the folder plus the chat to write the PRD and land the contract.

Them: So if you were to do that again, would life have been much better if there were a single click to basically say, take all these and make it into a PRD?

Me: 100%. Also, once I left, the product team still needed me back because not everyone was using Granola the way I was using it.

Them: What do you mean by that?

Me: Everyone else thought it was a meeting note taker. I was like, no, this is my work app. I was trying to feed as much as possible into it and then chat with it. That's how I was using it.

Them: What do you mean when you say you had to take things out of Granola, do research, and bring them back?

Me: If I wanted a competitor analysis, the conversation and task framing were in Granola but the internet-connected research had to happen elsewhere. I had to ask Granola a lot, copy the snippets, make a markdown file, use another research tool, then bring the results back.

Them: I get the sense Granola is beautifully designed but technically missing a lot.

Me: Yeah.

Them: What we think about with Sentra is the place where you go to do your work. It knows meetings, Slack, email, what you are working on, and what the organization is doing. I don't think you need all the separate tools if the system knows everything.

Me: Yeah, mostly. That is it.

Them: There is almost nothing that happens in a company that doesn't happen in meetings, Slack, or email.

Me: Maybe the codebase or Jira, but that also comes from those decisions.

Them: Exactly. Why was the code written? Why was the task created? That comes from the conversation. The primary information is there.

Me: Right.

Them: What part of Granola is really exciting or useful for you if you think transcript quality is weak?

Me: The chat. That's what got me hooked. Not the meeting notes. The chat is good enough. It surfaces what I should research or do next. But Granola still doesn't do the work. I want an assistant that starts background tasks and gives me a running start.

Them: So you like the recipes?

Me: I don't use them much, but I understand the power. It feels like someone smart wrote a good prompt over all my context and it gives me an angle or idea I would not have gotten myself.

Them: Why can't you just MCP into Claude?

Me: Granola's answers feel engineered in a way that understands what I am actually trying to achieve, not just the literal question. I haven't been able to recreate that well elsewhere.

Them: So you want it to do more work, and also prepare you for meetings before they happen?

Me: 100%. And sometimes I just use quick notes for monologues. If something happened in Slack, I drop the decision there, or I copy the thread in, or I summarize the missing context, then ask what I should do now.

Them: Is there real value in treating that as a separate kind of note?

Me: Yes, because it lets me preserve context that would otherwise be missing from the work. I have even imported huge CSVs of prompts to ask Granola what users were trying to do. I wanted all of that context in one place.

Me: Before this, I even bought the domain getmycontext.com. I wanted a way to package up all this context so I could give it to Claude, ChatGPT, or another person and they would immediately have the project state.

Them: That makes sense. If the direction is right, eventually the system should know enough that it tells you what should happen next and can trigger workflows itself.

Me: Yeah. Correct. Agreed.

Them: It is something like Lark, but Lark still works in structured data. I think the future should work from unstructured data first.

Me: Yeah. Correct. Agreed.

## Distilled Notes From External References

These notes are paraphrased from public product pages and are intentionally short.

### Granola

Reference links:

- [Granola](https://www.granola.ai/)
- [Granola Team Folders](https://www.granola.ai/blog/say-hello-to-team-folders)
- [Granola Workspaces](https://docs.granola.ai/help-center/workspaces)

Takeaways:

- Granola already frames itself as more than a note taker.
- The product direction is toward shared team context and collaborative workspace value, not only personal notes.
- Granola's strongest current wedge is bot-free meeting capture paired with AI enhancement and cross-meeting reasoning.
- The biggest gap between the wedge and the vision is action: turning context into coordinated work.

### Sentra

Reference link:

- [Sentra](https://www.sentra.app/)

Takeaways:

- Sentra explicitly frames the category as organizational memory.
- The public framing is about transforming collective knowledge, data, and decisions into living intelligence.
- The strongest ideas from Sentra's public site are:
  - a git log of decisions
  - unified timeline of commitments
  - proactive risk detection
  - follow-up memory
  - contextual onboarding
- This reinforces Yogurt's doctrine that memory is not just storage; it is operational leverage.

### Micro

Reference link:

- [Micro](https://www.micro.so/)

Takeaways:

- Micro frames the opportunity as one place for email, CRM, meetings, tasks, and AI.
- That framing validates the surface-level product shape Yogurt is moving toward.
- The important lesson is not "copy Micro feature for feature." The lesson is that the market is converging on unified work context rather than isolated AI point tools.

### Lark

Reference link:

- [Lark Superapp](https://www.larksuite.com/paid/superapp)

Takeaways:

- Lark proves that companies will work inside one app if the surfaces are integrated enough.
- The superapp model reduces tool-switching and increases the amount of context that naturally stays in one system.
- The important lesson for Yogurt is not to clone every module. The important lesson is that the integrated work surface is strategically correct.

## Themes That Should Survive Future Refactors

If contributors remember only a few themes from this appendix, they should remember these:

### 1. The user is trying to centralize work context, not collect notes

Notes matter because they preserve context. They are not the end product.

### 2. Chat is the real wedge after capture

The owner's strongest attachment to Granola is not the note artifact. It is the feeling of chatting with a context-rich system that "gets it."

### 3. Imports and monologues are not edge cases

They are evidence that the system should absorb work context regardless of source.

### 4. The next leap is action

The value jump happens when the system can move from:

- note
- to synthesis
- to recommendation
- to draft
- to workflow start

### 5. The product should stay human-in-control

The goal is not opaque automation. The goal is leverage with trust.

## Practical Prompts For Future Contributors

When working on Yogurt, ask:

- What context is missing from the current surface?
- Should this workflow live inside Yogurt instead of outside it?
- Are we making the AI smarter, or just adding another interface?
- Does this feature help the user stay in one work app longer?
- Are we preserving the why behind work, not just the final artifact?
