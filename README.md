# BluSlide.AI - The Idea Gallery

An intelligent idea exploration platform that learns from your browsing behavior to suggest creative concepts that match your taste.

## Features

- **Natural Browsing**: Browse curated galleries without forced interactions
- **Behavioral Tracking**: Intelligent attention tracking using hover patterns, dwell time, and section visits
- **AI-Powered Generation**: Uses Claude AI to generate initial concept galleries and targeted hybrid ideas
- **Progressive Refinement**: Each round gets more targeted based on what resonates with you

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes
- **AI**: Anthropic Claude API (Claude 3.5 Sonnet)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Anthropic API key ([Get one here](https://console.anthropic.com/))

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd BluSlide-Homepage
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```bash
cp .env.example .env
```

4. Add your Anthropic API key to `.env`:
```
ANTHROPIC_API_KEY=your_anthropic_api_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Enter Your Challenge**: Describe what you need creative help with (e.g., "Name my sustainable baby stroller company")
2. **Browse the Gallery**: Explore 80+ curated concepts across 8 thematic sections
3. **Natural Exploration**: Just browse - the system tracks what catches your attention
4. **Get Insights**: After 2 minutes, see what patterns emerged from your browsing
5. **Generate Hybrids**: Request targeted concepts that blend the qualities you responded to
6. **Iterate**: Continue exploring or generate new variations

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── generate-gallery/   # Initial gallery generation endpoint
│   │   └── generate-hybrids/   # Hybrid concept generation endpoint
│   ├── gallery/[sessionId]/    # Gallery view page
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Landing page
│   └── globals.css             # Global styles
├── components/
│   ├── ConceptCard.tsx         # Individual concept display
│   ├── SectionHeader.tsx       # Section divider
│   └── InsightsPanel.tsx       # Behavioral insights overlay
├── hooks/
│   └── useAttentionTracking.ts # Attention tracking hook
├── lib/
│   ├── gallery-generator.ts    # Initial gallery generation logic
│   └── hybrid-generator.ts     # Hybrid concept generation logic
└── types/
    └── index.ts                # TypeScript type definitions
```

## Key Features

### Attention Tracking

The system tracks:
- **Section Dwell Time**: How long you spend in each thematic section
- **Concept Hovers**: Which concepts you examine and for how long
- **Browsing Path**: The sequence of sections you visit
- **Revisits**: Sections and concepts you return to (strong interest signal)

### Gallery Generation

- 8 thematic sections with distinct strategic positioning
- 10-12 concepts per section (80-96 total)
- Each concept includes: name, tagline, and quality tags
- Strategic diversity across sections

### Hybrid Generation

- Identifies your 2-3 highest interest sections
- Extracts concepts you examined in detail
- Generates 20 new concepts that synthesize (not concatenate) qualities
- Shows attribution to parent concepts

## Environment Variables

- `ANTHROPIC_API_KEY`: Your Anthropic API key (required)
- `NEXT_PUBLIC_APP_URL`: Base URL for the application (optional)

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add the `ANTHROPIC_API_KEY` environment variable in Vercel settings
4. Deploy

The app will automatically deploy on every push to the main branch.

## MVP Scope

This is the Phase 1 MVP focusing on:
- Product naming use case
- Desktop/tablet experience
- Session-based (no database)
- No user accounts
- Basic export functionality

## Future Enhancements

- User accounts and saved sessions
- Multiple challenge types (taglines, messaging, positioning)
- Comparison and favorites tools
- Team collaboration features
- Mobile optimization
- Advanced analytics

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
