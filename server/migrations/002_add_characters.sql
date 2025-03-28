-- Drop existing tables
DROP TABLE IF EXISTS characters CASCADE;
DROP TABLE IF EXISTS books CASCADE;

-- Create books table if it doesn't exist
CREATE TABLE IF NOT EXISTS books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create characters table
CREATE TABLE IF NOT EXISTS characters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID NOT NULL REFERENCES books(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  role VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_characters_book_id ON characters(book_id);

-- Add trigger for updated_at
CREATE TRIGGER update_books_updated_at
  BEFORE UPDATE ON books
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_characters_updated_at
  BEFORE UPDATE ON characters
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add some sample data
INSERT INTO books (title, author)
VALUES ('Pride and Prejudice', 'Jane Austen')
ON CONFLICT DO NOTHING;

-- Insert sample characters for Pride and Prejudice
INSERT INTO characters (book_id, name, description, role)
SELECT 
  b.id,
  unnest(ARRAY[
    'Elizabeth Bennet',
    'Fitzwilliam Darcy',
    'Jane Bennet',
    'Charles Bingley',
    'Lydia Bennet'
  ]) as name,
  unnest(ARRAY[
    'The protagonist, second eldest of the Bennet sisters',
    'A wealthy gentleman, the master of Pemberley',
    'The eldest and most beautiful of the Bennet sisters',
    'A wealthy, friendly young gentleman',
    'The youngest and most impetuous Bennet sister'
  ]) as description,
  unnest(ARRAY[
    'Protagonist',
    'Love Interest',
    'Supporting',
    'Supporting',
    'Supporting'
  ]) as role
FROM books b
WHERE b.title = 'Pride and Prejudice'
ON CONFLICT DO NOTHING; 