# invitator9001

A modern, feature-rich event invitation management system built with Next.js 14. This project is inspired by birthdaiii but extends the functionality with additional features for comprehensive event management.

## Features

- 🎯 Streamlined guest tracking and RSVP management
- 🔗 Unique invitation links for each guest
- 📝 Customizable invitation templates with dynamic content
- 📱 WhatsApp and Telegram integration for sending invites
- 📅 Calendar integration (ICS file generation)
- 👥 Plus-one guest management
- 🌙 Dark mode support
- 🔒 Secure admin interface
- 📊 Real-time attendance tracking
- 💬 Group chat links for WhatsApp and Telegram

## Tech Stack

- Next.js 14 with App Router
- TypeScript
- Prisma with SQLite
- Tailwind CSS
- shadcn/ui components

## Setup

1. Clone the repository:
```bash
git clone https://github.com/paulpaul168/invitator.git
cd invitator
```

2. Install dependencies:
```bash
npm install
```

3. Create your configuration:
```bash
cp invitator-example.json invitator.json
```

4. Configure your event details in `invitator.json`. Make sure to update:
   - Event title and description
   - Date and location
   - Admin secret
   - Group chat links
   - Plus-one settings

5. Set up the database:
```bash
npx prisma db push
```

6. Start the development server:
```bash
npm run dev
```

## Production Deployment

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

For systemd-based deployments, a service file is provided in `invitator.service`.

## Configuration

The `invitator.json` file controls all event-specific settings. Key configuration options include:

- `title`: Event title
- `date`: Event date and time
- `location`: Event location
- `adminSecret`: Secret key for admin access
- `groupChat`: WhatsApp group chat link
- `groupChatTelegram`: Telegram group chat link
- `maxPlusOne`: Maximum number of additional guests allowed
- `description`: Event description and details
- `eventInfo`: Additional event information

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by [birthdaiii](https://github.com/flofriday/birthdaiii)
- Built with [shadcn/ui](https://ui.shadcn.com/) components