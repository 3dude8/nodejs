import express from 'express';
import { engine } from 'express-handlebars';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import path from 'path';

const app = express();
const PORT = 3000;

// Handlebars view 
app.engine('hbs', engine({
  extname: '.hbs', 
  defaultLayout: 'main', 
  layoutsDir: path.join(__dirname, 'views/layouts'), 
  partialsDir: path.join(__dirname, 'views/partials') 
}));

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '..', 'src', 'views')); 

app.use(express.urlencoded({ extended: true })); // Handles HTML form data
app.use(express.static(path.join(__dirname, '..', 'src', 'public'))); // Serves static files

app.use(express.json());
app.use(userRoutes);
app.use(authRoutes);

//Clarify API is running in root dir
app.get('/', (req, res) => {
  res.send('API is running!');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
