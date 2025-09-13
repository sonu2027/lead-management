import mongoose from "mongoose"
import { Lead } from "./models/leads.model.js"

const sampleLeads = [
  {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '1234567890',
  },
  {
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '9876543210',
  },
  {
    name: 'Mike Johnson',
    email: 'mike.johnson@example.com',
    phone: '5555555555',
  },
  {
    name: 'Sarah Wilson',
    email: 'sarah.wilson@example.com',
    phone: '1111111111',
  },
  {
    name: 'David Brown',
    email: 'david.brown@example.com',
    phone: '2222222222',
  },
  {
    name: 'Lisa Davis',
    email: 'lisa.davis@example.com',
    phone: '3333333333',
  },
  {
    name: 'Tom Anderson',
    email: 'tom.anderson@example.com',
    phone: '4444444444',
  },
  {
    name: 'Emma Taylor',
    email: 'emma.taylor@example.com',
    phone: '6666666666',
  },
  {
    name: 'Chris Miller',
    email: 'chris.miller@example.com',
    phone: '7777777777',
  },
  {
    name: 'Amy Garcia',
    email: 'amy.garcia@example.com',
    phone: '8888888888',
  },
  {
    name: 'Ryan Martinez',
    email: 'ryan.martinez@example.com',
    phone: '9999999999',
  },
  {
    name: 'Jessica Lee',
    email: 'jessica.lee@example.com',
    phone: '1010101010',
  }
];

const DB_NAME = 'personal-finance-manager'

async function addSampleLeads() {
  try {
    await mongoose.connect(`${process.env.DB_URL}/${DB_NAME}` || process.env.LOCAL_DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    await Lead.deleteMany({});
    console.log('Cleared existing leads');

    const createdLeads = await Lead.insertMany(sampleLeads);
    console.log(`Added ${createdLeads.length} sample leads`);

    // pagination example
    console.log('\n--- Pagination Example ---');
    console.log('Total leads:', createdLeads.length);
    console.log('Leads per page: 5');
    console.log('Total pages:', Math.ceil(createdLeads.length / 5));
    console.log('\nPage 1: Leads 1-5');
    console.log('Page 2: Leads 6-10');
    console.log('Page 3: Leads 11-12');

    process.exit(0);
  } catch (error) {
    console.error('Error adding sample leads:', error);
    process.exit(1);
  }
}

addSampleLeads();