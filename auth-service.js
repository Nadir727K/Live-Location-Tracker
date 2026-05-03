import jwt from "jsonwebtoken";

const SECRET = "dev_secret_key_change_later";

// MOCK USERS 
const users = [
  { id: "user1", name: "Nadir" },
  { id: "user2", name: "Student2" }
];

// LOGIN CONTROLLER
export function login(req, res) {
  const { userId } = req.body;

  const user = users.find(u => u.id === userId);

  if (!user) {
    return res.status(401).json({ message: "Invalid user" });
  }

  const token = jwt.sign(
    { userId: user.id, name: user.name },
    SECRET,
    { expiresIn: "2h" }
  );

  return res.json({ token });
}

// VERIFY FUNCTION 
export function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch (err) {
    return null;
  }
}