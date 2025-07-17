require('dotenv').config();
console.log("🔍 MONGO_URL from env:", process.env.MONGO_URL);

var express= require('express');//importing
const bcrypt = require('bcrypt');
var cors = require('cors')
require('./connection.js');
//var empModel=require('./models/employee.js');//importing employee model
const userModel = require('./models/user.js');
const TestModel = require('./models/test');
const StudentSubmission = require('./models/studentSubmission');

const app=express();//initialize
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET;

app.use(express.json());//middleware to parse JSON data
app.use(cors());//middleware to allow cross-origin requests

app.get('/', (req, res) => {//api creation
  res.send('Hello World')//we send a request and receive a response from backend as hello world
})

app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).send("User already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      role: "user" // default
    });

    await newUser.save();

    res.status(200).send("User registered successfully");
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).send("User not found");
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send("Invalid password");
    }

    // Create JWT token
    const payload = {
      id: user._id,
      role: user.role
    };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });

    res.status(200).send({ message: "Login successful", token, role: user.role });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});


app.post('/create-test', async (req, res) => {
  try {
    const { testName, questions } = req.body;
    const newTest = new TestModel({ testName, questions });
    await newTest.save();
    res.status(200).send("Test saved successfully!");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error saving test");
  }
});

app.get('/get-tests', async (req, res) => {
  try {
    const tests = await TestModel.find();
    res.status(200).json(tests);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching tests");
  }
});
app.get('/get-test-results/:testId', async (req, res) => {
  try {
    const testId = req.params.testId;
    const submissions = await StudentSubmission.find({ testId }).populate('studentId', 'name');

    // Format data
    const formattedResults = submissions.map((submission) => ({
      name: submission.studentId?.name || 'Unknown',
      marks: submission.score,
    }));

    res.status(200).json(formattedResults);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching test results");
  }
});


app.delete('/delete-test/:id', async (req, res) => {
  try {
    await TestModel.findByIdAndDelete(req.params.id);
    res.status(200).send("Test deleted successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting test");
  }
});

app.put('/update-test/:id', async (req, res) => {
  try {
    await TestModel.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).send("Test updated successfully!");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating test");
  }
});

app.post('/submit-test', async (req, res) => {
  try {
    const { testId, answers, token } = req.body;

    // Decode token to get student ID
    const decoded = jwt.verify(token, SECRET_KEY);
    const studentId = decoded.id;

    // Find the test document
    const test = await TestModel.findById(testId);
    if (!test) {
      return res.status(404).send("Test not found");
    }

    // Calculate score
    let score = 0;
    const correctAnswers = test.questions.map(q => q.correctOption);
    correctAnswers.forEach((correct, idx) => {
      if (answers[idx] === correct) {
        score++;
      }
    });

    const maxScore = test.questions.length;

    // Save to submissions collection
    const submission = new StudentSubmission({
      studentId,
      testId,
      testName: test.testName,
      answers,
      score,
      maxScore,
    });

    await submission.save();

    res.status(200).send({ message: "Test submitted and scored!", score, maxScore });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error submitting test");
  }
});
app.get('/get-submissions/:studentId', async (req, res) => {
  try {
    const submissions = await StudentSubmission.find({ studentId: req.params.studentId });
    res.status(200).json(submissions);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching submissions");
  }
});



app.get('/trial',(req,res)=>{
  res.send("This is a trial message")
})



app.listen(process.env.PORT || 3000,()=>
{
   console.log("Port 3000 is connected")
})

