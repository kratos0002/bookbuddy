# BookBuddy: Talk to Your Books

BookBuddy is an AI-powered conversational interface that allows you to engage with literary works through character simulations and literary analysis. The current implementation focuses on George Orwell's "1984" but is designed to be extensible to other works.

## 🌟 Features

### Character Conversations
- **Character Simulation**: Chat with key characters from "1984" including:
  - Winston Smith: The protagonist, a thoughtful but fearful dissident
  - Julia: A rebellious Party member who becomes Winston's lover
  - O'Brien: A mysterious Inner Party member with complex motives
  - Big Brother: The omnipresent figurehead of the totalitarian regime
  - Emmanuel Goldstein: The alleged leader of the resistance movement

### Literary Analysis
- **Alexandria the Librarian**: Get expert literary analysis on various aspects of the book, including:
  - Thematic exploration
  - Character motivations
  - Historical context
  - Narrative techniques
  - Contemporary relevance

### Advanced Literary Processing
- **BookNLP Integration**: Leverages computational linguistics to extract:
  - Character networks and relationships
  - Thematic elements and their distribution across the text
  - Character mentions and appearances
  - Dialogue attribution and analysis

### AI-Enhanced Understanding
- **Context-Enriched Responses**: Character and librarian responses are augmented with:
  - Theme-specific knowledge extracted from the text
  - Character relationship awareness
  - Quote-based authenticity
  - Sentiment analysis for tone-appropriate responses

## 🛠️ Technical Implementation

### Chat System Architecture

The chat system implements a sophisticated pipeline:

1. **Message Analysis**:
   - User messages are analyzed for relevant themes and character references
   - Sentiment scoring provides emotional context (-1 to 1 scale)

2. **Context Enrichment**:
   - Character responses are enriched with relationship data and authentic traits
   - Librarian responses are augmented with thematic connections

3. **Conversation Management**:
   - Conversations maintain context through persistent storage
   - Character-based and analysis-based conversation modes
   - Support for multi-character conversations

### API Endpoints

#### Chat Endpoints
- `POST /api/chat/test`: Test the chat system with a message
- `POST /api/conversations`: Create a new conversation
- `GET /api/conversations`: Get all conversations
- `GET /api/conversations/:id`: Get a specific conversation
- `POST /api/conversations/:id/messages`: Add a message to a conversation

#### Literary Data Endpoints
- `GET /api/books`: Get all books
- `GET /api/books/:id`: Get a specific book
- `GET /api/books/:id/chapters`: Get chapters of a book
- `GET /api/books/:id/themes`: Get themes in a book
- `GET /api/books/:id/characters`: Get characters in a book
- `GET /api/books/:id/relationships`: Get character relationships
- `GET /api/books/:id/character-network`: Get visual character network data
- `GET /api/books/:id/narrative-data`: Get narrative arc data
- `GET /api/books/:id/theme-heatmap`: Get theme distribution data

## 🧠 BookNLP Processing

BookBuddy leverages BookNLP for deep literary analysis:

### Current Implementation
- Sample data mimicking BookNLP output structure
- Character information and relationships
- Thematic elements and their occurrences
- Sample quotes and character attributes

### Full Processing (Available Offline)
Instructions for running complete BookNLP processing:
1. Install BookNLP: `pip install booknlp`
2. Process text using `process_1984.py`
3. Convert output to structured JSON using `convert_to_structured_json()`
4. Place JSON files in the `book_processing/data` directory

## 📋 Project Structure

```
.
├── book_processing/              # BookNLP and text processing scripts
│   ├── data/                     # Processed book data
│   ├── output/                   # BookNLP output files
│   ├── analyze_data.py           # Data analysis utilities
│   ├── extract_pdf_text.py       # PDF text extraction
│   ├── process_1984.py           # BookNLP processing for 1984
│   └── generate_sample_data.py   # Sample data generation
├── server/
│   ├── services/
│   │   ├── book-context-service.ts  # Literary context service
│   │   └── openai-service.ts        # OpenAI integration
│   ├── routes.ts                 # API endpoints
│   └── storage.ts                # Data storage interface
├── shared/
│   └── schema.ts                 # Data models and schemas
└── client/                       # Frontend React application
```

## 🚀 Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables:
   ```
   DATABASE_URL=<your-database-url>
   OPENAI_API_KEY=<your-openai-key>
   ```
4. Start the application: `npm run dev`

## 📚 Using the Chat Interface

### Character Mode
- Select a character to chat with from the character selection menu
- Message the character with questions about their experiences, thoughts, or the world of the book
- Characters will respond in their authentic voice, maintaining consistency with their personality in the book

### Librarian Mode
- Select "Alexandria" the librarian for literary analysis
- Ask about themes, writing techniques, historical context, or interpretations
- Get detailed, educational responses about literary elements

## 🔮 Future Enhancements

- Support for additional literary works
- Character memory for longer conversations
- Multi-book comparative analysis
- Custom character creation
- Audio narration for character responses
- Visual scene recreation from text descriptions
- User-uploaded book processing

## 📄 License

MIT

## Deployment Instructions

### Deploying to Render

Follow these steps to deploy the BookBuddy backend to Render:

1. **Create a new Web Service on Render**
   - Go to [dashboard.render.com](https://dashboard.render.com/)
   - Click "New +" and select "Web Service"
   - Connect your GitHub repository or use the public GitHub URL

2. **Configure the Web Service**
   - Name: `bookbuddy-api` (or your preferred name)
   - Environment: `Node`
   - Region: Choose the closest to your users
   - Branch: `main` (or your deployment branch)
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start`
   - Plan: Select the appropriate plan (Free tier works for testing)

3. **Set Environment Variables**
   - OPENAI_API_KEY: Your OpenAI API key
   - DATABASE_URL: Your database connection URL
   - ADMIN_TOKEN: A secure token for admin access
   - NODE_ENV: `production`

4. **Create the Web Service**
   - Click "Create Web Service"
   - Wait for the deployment to complete

5. **Update Client Configuration**
   - Once deployed, update the client's `.env` file with the new API URL:
   ```
   VITE_API_URL=https://your-render-service-url.onrender.com
   ```

### Backend Environment Variables

The backend requires the following environment variables:

- `OPENAI_API_KEY`: Your OpenAI API key for AI functionality
- `DATABASE_URL`: Connection URL for your database
- `ADMIN_TOKEN`: Secure token for admin access
- `NODE_ENV`: Set to `production` for deployment
- `PORT`: (Optional) Port to run the server on (defaults to 3000)

Set these in your Render dashboard under the "Environment" section of your web service.