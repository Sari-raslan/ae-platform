export class FeedbackManager {
  constructor() {
    this.items = JSON.parse(localStorage.getItem("uaos_feedback") || "[]");
  }

  addFeedback(data) {
    const item = {
      id: crypto.randomUUID(),
      ...data,
      createdAt: new Date().toISOString()
    };

    this.items.unshift(item);
    localStorage.setItem("uaos_feedback", JSON.stringify(this.items));

    return item;
  }

  clear() {
    this.items = [];
    localStorage.removeItem("uaos_feedback");
  }

  exportJSON() {
    return {
      version: "7.1.0",
      exportedAt: new Date().toISOString(),
      feedback: this.items
    };
  }

  status() {
    return {
      total: this.items.length,
      items: this.items
    };
  }
}

export const feedbackManager = new FeedbackManager();
