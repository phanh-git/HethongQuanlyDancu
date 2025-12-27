# Migration Guide: MongoDB to PostgreSQL

## Overview

The system has been migrated from MongoDB to PostgreSQL for better data integrity, ACID compliance, and SQL querying capabilities.

## What Changed

### Dependencies
**Before (MongoDB):**
- mongoose: ^8.0.3

**After (PostgreSQL):**
- sequelize: ^6.35.2
- pg: ^8.11.3
- pg-hstore: ^2.3.4

### Environment Variables
**Before (.env):**
```env
MONGODB_URI=mongodb://localhost:27017/population_management
```

**After (.env):**
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=population_management
DB_USER=postgres
DB_PASSWORD=postgres
```

### Database Models

All models have been converted from Mongoose schemas to Sequelize models:

#### ID Fields
- **MongoDB:** `_id` (ObjectId)
- **PostgreSQL:** `id` (UUID v4)

#### Relationships
- **MongoDB:** ObjectId references
- **PostgreSQL:** UUID foreign keys with proper associations

#### Data Types
| MongoDB | PostgreSQL (Sequelize) |
|---------|----------------------|
| String | DataTypes.STRING / TEXT |
| Number | DataTypes.INTEGER / FLOAT |
| Boolean | DataTypes.BOOLEAN |
| Date | DataTypes.DATE |
| Object | DataTypes.JSONB |
| Array | DataTypes.ARRAY or JSONB |
| ObjectId | DataTypes.UUID |
| Enum | DataTypes.ENUM |

#### Example Conversion

**Mongoose (Before):**
```javascript
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  role: {
    type: String,
    enum: ['admin', 'staff'],
    default: 'staff'
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
```

**Sequelize (After):**
```javascript
const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  role: {
    type: DataTypes.ENUM('admin', 'staff'),
    defaultValue: 'staff'
  }
}, {
  timestamps: true
});

module.exports = User;
```

### Query Changes

#### Finding Records
**Mongoose:**
```javascript
await User.findById(id);
await User.findOne({ username });
await User.find({ role: 'admin' });
```

**Sequelize:**
```javascript
await User.findByPk(id);
await User.findOne({ where: { username } });
await User.findAll({ where: { role: 'admin' } });
```

#### Creating Records
**Mongoose:**
```javascript
await User.create({ username, password });
```

**Sequelize:**
```javascript
await User.create({ username, password }); // Same!
```

#### Updating Records
**Mongoose:**
```javascript
user.lastLogin = new Date();
await user.save();
```

**Sequelize:**
```javascript
user.lastLogin = new Date();
await user.save(); // Same!
```

#### Complex Queries
**Mongoose:**
```javascript
const users = await User.find({
  $or: [{ username }, { email }]
});
```

**Sequelize:**
```javascript
const { Op } = require('sequelize');
const users = await User.findAll({
  where: {
    [Op.or]: [{ username }, { email }]
  }
});
```

### Virtual Fields

**Mongoose:**
```javascript
populationSchema.virtual('age').get(function() {
  // calculation
});
```

**Sequelize:**
```javascript
const Population = sequelize.define('Population', {
  // fields...
}, {
  getterMethods: {
    age() {
      // calculation
    }
  }
});
```

### Hooks/Middleware

**Mongoose:**
```javascript
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
```

**Sequelize:**
```javascript
const User = sequelize.define('User', {
  // fields...
}, {
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        user.password = await bcrypt.hash(user.password, 10);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 10);
      }
    }
  }
});
```

## Installation Steps

### 1. Install PostgreSQL

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo service postgresql start
```

**macOS:**
```bash
brew install postgresql
brew services start postgresql
```

**Windows:**
Download from https://www.postgresql.org/download/windows/

### 2. Create Database

```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE population_management;

# Create user (optional)
CREATE USER pop_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE population_management TO pop_user;
```

### 3. Update Environment Variables

Copy `.env.example` to `.env` and configure:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=population_management
DB_USER=postgres
DB_PASSWORD=postgres
```

### 4. Install Dependencies

```bash
cd backend
npm install
```

### 5. Seed Database

```bash
npm run seed
```

## Benefits of PostgreSQL

✅ **ACID Compliance:** Better transaction support  
✅ **Data Integrity:** Foreign key constraints  
✅ **Performance:** Better for complex joins and queries  
✅ **Mature Ecosystem:** Wide tooling support  
✅ **JSONB Support:** Flexible schema when needed  
✅ **Full-text Search:** Built-in search capabilities  
✅ **Scalability:** Better for large datasets  

## Troubleshooting

### Connection Issues

**Error:** `ECONNREFUSED`
- **Solution:** Make sure PostgreSQL is running
  ```bash
  # Linux
  sudo service postgresql status
  
  # Mac
  brew services list
  ```

### Authentication Failed

**Error:** `password authentication failed`
- **Solution:** Check credentials in `.env` file
- **Alternative:** Use `trust` authentication for local development
  - Edit `/etc/postgresql/*/main/pg_hba.conf`
  - Change `md5` to `trust` for local connections
  - Restart PostgreSQL

### Database Does Not Exist

**Error:** `database "population_management" does not exist`
- **Solution:** Create the database
  ```bash
  createdb -U postgres population_management
  ```

### Port Already in Use

**Error:** `Port 5432 is already in use`
- **Solution:** Either stop the existing PostgreSQL or change the port in `.env`

## Data Migration (if needed)

If you have existing MongoDB data, you'll need to export and import:

1. Export from MongoDB:
```bash
mongoexport --db=population_management --collection=users --out=users.json
```

2. Convert the data format (manual or script)

3. Import to PostgreSQL:
```javascript
// Use seed script or custom migration script
```

## Support

For issues or questions about the PostgreSQL migration:
- Check PostgreSQL logs: `/var/log/postgresql/`
- Run with debug logging: Set `logging: console.log` in database config
- Contact support with error details

## References

- [Sequelize Documentation](https://sequelize.org/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [PostgreSQL vs MongoDB](https://www.postgresql.org/about/)
