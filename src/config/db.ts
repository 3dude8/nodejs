import { AppDataSource } from './data-source';

const connectDB = async () => {
  try {
    console.log('🔄 Attempting to connect to MySQL...');
    
    await AppDataSource.initialize();
    
    console.log(`✅ MySQL Connected Successfully!`);
    console.log(`   Database: ${AppDataSource.options.database}`);
    
  } catch (error: any) {
    console.error(`❌ MySQL Connection Failed:`);
    console.error(`   Error: ${error.message}`);
    console.error(`   Make sure MySQL is running and database exists`);
    process.exit(1);
  }
};

export default connectDB;
