import { db } from '../db';

async function checkConversationsTable() {
  try {
    console.log('Checking conversations table structure...');
    
    // Check column names and types
    const columns = await db`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'conversations'
      ORDER BY column_name
    `;
    
    console.log(`Found ${columns.length} columns in conversations table:`);
    columns.forEach(col => {
      console.log(`- ${col.column_name} (${col.data_type})`);
    });
    
    console.log('\nDone checking conversations table.');
  } catch (error) {
    console.error('Error checking conversations table:', error);
  }
}

checkConversationsTable().catch(console.error); 