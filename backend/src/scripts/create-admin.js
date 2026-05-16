import 'dotenv/config';
import { connectDatabase } from '../config/database.js';
import { syncModels, User } from '../models/index.js';

async function run() {
  const email = process.argv[2] || process.env.DEFAULT_ADMIN_EMAIL;
  const fullName = process.argv[3] || process.env.DEFAULT_ADMIN_NAME || 'Portfolio Admin';
  const firebaseUid = process.argv[4] || process.env.DEFAULT_ADMIN_FIREBASE_UID;

  if (!email || !firebaseUid) {
    throw new Error('Provide email and a real Firebase UID as arguments or in .env');
  }

  await connectDatabase();
  await syncModels();

  const [user, created] = await User.findOrCreate({
    where: { email },
    defaults: {
      firebase_uid: firebaseUid,
      email,
      full_name: fullName,
      role: 'admin',
      status: 'active'
    }
  });

  if (!created) {
    user.role = 'admin';
    user.status = 'active';
    if (!user.firebase_uid) {
      user.firebase_uid = firebaseUid;
    }
    await user.save();
  }

  console.log(`Admin user ready: ${user.email} (${user.id})`);
  process.exit(0);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
