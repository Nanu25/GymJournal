import { AppDataSource } from '../config/database';

async function testConnection() {
    try {
        console.log('Testing Supabase connection...');
        await AppDataSource.initialize();
        console.log('Successfully connected to Supabase!');
        
        // Test a simple query
        const result = await AppDataSource.query('SELECT current_timestamp');
        console.log('Database time:', result[0].current_timestamp);
        
        // Drop existing constraints with CASCADE
        console.log('Dropping existing constraints...');
        await AppDataSource.query(`
            DO $$ 
            DECLARE
                r RECORD;
            BEGIN
                -- Drop foreign key constraints
                FOR r IN (SELECT tc.constraint_name, tc.table_name 
                         FROM information_schema.table_constraints tc 
                         WHERE tc.constraint_type = 'FOREIGN KEY' 
                         AND tc.table_schema = 'public') 
                LOOP
                    EXECUTE 'ALTER TABLE public.' || quote_ident(r.table_name) || 
                            ' DROP CONSTRAINT ' || quote_ident(r.constraint_name) || ' CASCADE';
                END LOOP;
                
                -- Drop primary key constraints
                FOR r IN (SELECT tc.constraint_name, tc.table_name 
                         FROM information_schema.table_constraints tc 
                         WHERE tc.constraint_type = 'PRIMARY KEY' 
                         AND tc.table_schema = 'public') 
                LOOP
                    EXECUTE 'ALTER TABLE public.' || quote_ident(r.table_name) || 
                            ' DROP CONSTRAINT ' || quote_ident(r.constraint_name) || ' CASCADE';
                END LOOP;
            END $$;
        `);
        
        // Test if we can create tables
        console.log('Testing table creation...');
        await AppDataSource.synchronize();
        console.log('Successfully synchronized database schema!');
        
        process.exit(0);
    } catch (error) {
        console.error('Error connecting to Supabase:', error);
        process.exit(1);
    }
}

testConnection(); 