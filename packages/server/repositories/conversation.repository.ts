// implementation detail
const conversations: Record<string, any[]> = {};

// export public interface
export const conversationRepository = {
   getConversationId(conversationId: string) {
      return conversations[conversationId];
   },
   setConversationId(conversationId: string, message: any[]) {
      conversations[conversationId] = message;
   },
};
