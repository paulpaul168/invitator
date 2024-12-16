# invitator9001

An over engineered invitation management webapp.

## Features
- Keep track of who you invite and who accepts.
- Send out customized links for each guest.
- Write an invitation template and automatically fill in the name.
- Modern, responsive design.
- Secure admin interface.

## Run it yourself
```
npm install
cp invitator-example.json invitator.json
npx prisma db push
npm run dev
```

**Note:** For production deployment, use `npm run build && npm run start` instead of the development server.

## Configuration

Configuration is handled through `invitator.json` (create this from the provided example file). This file contains:
- Event details
- Location information
- Admin secret
- Custom messaging templates

The example configuration file (`invitator-example.json`) is provided as a template.

## Usage

1. Access the admin interface at `/admin/{secret}` (secret is defined in `invitator.json`)
2. Create invitations for your guests
3. Customize the invitation template
4. Share the generated invitation links

Each guest gets a unique URL to respond to their invitation.

## Deployment

The application can be deployed as a systemd user service on Linux. A sample service configuration is provided in `invitator.service`.

## Tech Stack
- Next.js
- Prisma
- TypeScript
- Tailwind CSS