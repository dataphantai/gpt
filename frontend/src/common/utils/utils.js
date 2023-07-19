export const scrollToBottom = (element) =>
    setTimeout(() => (element.scrollTop = element.scrollHeight), 0);
