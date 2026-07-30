# Study HUB - API Documentation

## Auth Endpoints
- `POST /api/auth/register` - Create student user account
- `POST /api/auth/login` - Authenticate & generate JWT token
- `GET /api/auth/me` - Get current authenticated user profile

## Document & RAG Endpoints
- `POST /api/documents/upload` - Upload PDF/DOCX/TXT study materials
- `GET /api/documents` - Fetch uploaded document library
- `DELETE /api/documents/:id` - Remove document from library

## AI Toolkit & Chat Endpoints
- `POST /api/ai/:toolType` - Universal endpoint for AI Toolkit generators
- `POST /api/chat` - Query GINI AI assistant (RAG Engine)
