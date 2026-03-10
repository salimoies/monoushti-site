const textElement = document.getElementById("text");
const answersElement = document.getElementById("answers");

let currentStep = "Q1";

const story = {
  Q1: {
    text: "جاهزة لأن مساعدك الشخصي أنا هوزان لحنا؟",
    answers: [
      { text: "جاهزة", next: "Q2" },
      { text: "لا", next: "T1" },
      { text: "ما عندي وقت", next: "T2" }
    ]
  },

  T1: {
    text: "مبلا جاهزة، بس عم تدللي.",
    next: "Q2"
  },

  T2: {
    text: "لا بأس، أنا هوزان بس لمساعدتك.",
    next: "Q2"
  },

  Q2: {
    text: "هل تتوقعي بـ سليم؟",
    answers: [
      { text: "أبداً", next: "Q4" },
      { text: "نص نص", next: "Q3" },
      { text: "أحياناً", next: "Q3" },
      { text: "يتوق", next: "Q6" }
    ]
  },

  Q3: {
    text: "ليش بعادكم عن بعض؟",
    answers: [
      { text: "لأنه ما يفهمني", next: "T3" },
      { text: "لأنه جرحني", next: "Q5" },
      { text: "ما عندي وقت إلك ولسليم", next: "T2" },
      { text: "هو اللي بعد عني", next: "Q6" }
    ]
  },

  T3: {
    text: "أنتِ دائماً تقولي هيك، بس شوي اهدي.",
    next: "Q5"
  },

  Q4: {
    text: "هل تحسينه متعمد يأذيك؟",
    answers: [
      { text: "أي", next: "Q8" },
      { text: "لا", next: "Q3" },
      { text: "يمكن", next: "Q6" },
      { text: "ما يهمني", next: "E4" }
    ]
  },

  Q5: {
    text: "شو أكثر شي زعلك منه؟",
    answers: [
      { text: "كلام قاله", next: "Q6" },
      { text: "تصرف عمله", next: "Q8" },
      { text: "هو اللي بعد عني", next: "Q7" }
    ]
  },

  Q6: {
    text: "هل كان عنده سبب؟",
    answers: [
      { text: "لا", next: "Q9" },
      { text: "كان عنده", next: "Q8" },
      { text: "خان ثقتي", next: "T4" }
    ]
  },

  T4: {
    text: "هاد أسوأ شي ممكن إنسان يعمله.",
    next: "Q10"
  },

  Q7: {
    text: "تتوقعي كان لو الكلام بينكم أوضح كان ممكن يتغير شي؟",
    answers: [
      { text: "كان ممكن يتغير كلشي", next: "Q11" },
      { text: "ماكن يفيد", next: "E3" },
      { text: "ما بعرف", next: "E1" }
    ]
  },

  Q8: {
    text: "برأيك متى بدأت العلاقة تتغير؟",
    answers: [
      { text: "لما صار بعد بينا", next: "Q9" },
      { text: "لما صرنا نفهم بعض أقل", next: "Q10" },
      { text: "هو اللي تغير", next: "E3" },
      { text: "ما بعرف", next: "E1" }
    ]
  },

  Q9: {
    text: "عندك فضول تعرفي بشو كان يفكر؟",
    answers: [
      { text: "عندي", next: "Q11" },
      { text: "شي صغيرة", next: "E1" },
      { text: "ما يهمني", next: "E4" }
    ]
  },

  Q10: {
    text: "هل تحسينه تغير؟",
    answers: [
      { text: "يمكن", next: "Q11" },
      { text: "ما أتوقع أبداً", next: "E3" },
      { text: "تغير كثير", next: "E2" },
      { text: "أي بس مترددة", next: "E1" }
    ]
  },

  Q11: {
    text: "هل تقدرين تعطوه بعض فرصة؟",
    answers: [
      { text: "أي", next: "E2" },
      { text: "لا أبداً", next: "E4" },
      { text: "ما أوافق فيه", next: "E3" }
    ]
  },

  E1: {
    text: "لسا في شي بالقلب."
  },

  E2: {
    text: "عطو بعض فرصة."
  },

  E3: {
    text: "صرت أكره سليم مثلك."
  },

  E4: {
    text: "الله يوفقك بحياتك."
  }
};

function showStep(stepId) {
  const data = story[stepId];
  textElement.innerText = data.text;
  answersElement.innerHTML = "";

  if (data.answers) {
    data.answers.forEach(answer => {
      const button = document.createElement("button");
      button.innerText = answer.text;
      button.onclick = () => {
        currentStep = answer.next;
        showStep(currentStep);
      };
      answersElement.appendChild(button);
    });
  } else if (data.next) {
    setTimeout(() => {
      showStep(data.next);
    }, 5000);
  } else {
    const restartButton = document.createElement("button");
    restartButton.innerText = "إعادة من البداية";
    restartButton.onclick = () => {
      currentStep = "Q1";
      showStep(currentStep);
    };
    answersElement.appendChild(restartButton);
  }
}

showStep(currentStep);
