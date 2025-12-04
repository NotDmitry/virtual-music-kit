# Virtual Music Kit

## [Original Task](https://github.com/rolling-scopes-school/tasks/tree/master/stage1/tasks/virtual-music-kit)

## Description

The Virtual Music Kit is an interactive sound application inspired by a real musical instrument (guitar).
Users are able to play sounds live (by clicking visual elements and/or by pressing assigned keyboard keys), or reproduce a sequence of available sounds of their choice.

## Key skills

- DOM manipulation
- Event handling
- Audio playback in the browser

## Features

1. The application's visual layout represents guitar strings.

2. The application includes **7 distinct sounds (or notes)** related to the guitar.
   - Each sound and its corresponding visual element is mapped to **one unique keyboard key**.
   - Only **English letter keys** are used for this purpose.
   - The default key assignments **always remain the same** after a page refresh and **aren't generated randomly**.
   - The same key **can't be assigned** to more than one sound.
   - The assigned keys are **visibly displayed** on the screen and **clearly associated** with the corresponding guitar parts.
   - Each sound can be triggered **either by pressing** its assigned keyboard key **or by clicking** on the corresponding visual element.

3. There is an **edit button/icon** next to each key.
   - When the user clicks an **edit button**, the selected key appears in a dedicated **input field** on the screen.
   - After entering a new key and pressing **Enter**, the edit input disappears and the app updates the assigned key for that sound and visually refreshes the corresponding label on the interface.
   - The app prevents assigning the **same key to multiple sounds** when reassigning controls.
   - Any changes made by the user are **temporary** and do **not persist after a page refresh**.

4. Every "playable" element has **three visual states**: default, hover, and active.

5. When the user clicks a **visual element** or presses the corresponding **keyboard key**:
   - The corresponding sound is **played once** (it is not repeated if the user keeps pressing the key or mouse).
   - Pressing the **same key or visual element again** plays the corresponding sound **once more**.
   - The visual element switches to its **active state**, which lasts as long as the user keeps pressing the key or mouse.
   - A note is played **regardless of the keyboard layout** (Russian or English) and **Caps Lock** state.
   - **Only one key** is processed at a time. If the user attempts to press multiple keys simultaneously, the application will process only the **first key press detected** to prevent multiple inputs from being registered at the same moment.

6. There is an **input field** where the user can type a sequence of the assigned keys (for example: `ASDFG`).
   - Only the keys **assigned to the app’s sounds** are allowed.
   - Invalid characters are **prevented**.
   - Both **uppercase and lowercase** letters are accepted.
   - The maximum number of characters in the input is **twice the number of available sounds/keys**.
   - Each key can appear **multiple times** in the sequence.

7. There is a **button** that allows the user to **play the entered sequence**. When clicked:
   - The app plays the sounds **one by one**, in the order typed in the sequence.
   - While each sound is playing, the corresponding visual element switches to its **active state**, which ends when the sound stops playing.
   - There is a short, consistent **delay between each step** in the sequence to avoid sound overlap.

8. During the **automatic playback**:
   - The user cannot click or press any new keys (**interactions are disabled**).
   - The input field and play button are **disabled until playback ends**.

9. After playback finishes, **interactivity is fully restored**.
