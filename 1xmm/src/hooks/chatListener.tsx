import express, { Application } from "express";
import bodyParser from 'body-parser';

export const launchMessageListener = (): void => {
    const app: Application = express();
    const PORT = 3000;
  
    // Middleware to parse JSON requests
    app.use(bodyParser.json());
  
    // Telegram webhook endpoint
    app.post('/telegram-webhook', (req, res) => {
      const update = req.body;
  
      // Check if the update contains a message
      if (update.message) {
          const chatId = update.message.chat.id;
          const text = update.message.text;
  
          console.log(`Received message from chat ID ${chatId}: ${text}`);
  
          // Check if it's a referral update message
          if (text.startsWith('Referral Update:')) {
              // Extract details from the message
              const match = text.match(/Referral Update: Invitee (.+) connected. Reward: (.+)/);
              if (match) {
                  const inviteeName = match[1];
                  const rewardDetails = match[2];
  
                  // Handle reward update logic
                  handleRewardUpdate(chatId, inviteeName, rewardDetails);
              }
          }
      }
  
      // Send a 200 response to Telegram
      res.sendStatus(200);
    });
  
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  }

  function handleRewardUpdate(chatId: number, inviteeName: string, rewardDetails: string): void {
    console.log(`Updating reward for chat ID ${chatId}`);
    console.log(`Invitee: ${inviteeName}, Reward: ${rewardDetails}`);
  
    // TODO: Update inviter's reward in your database or mini-app logic
  }