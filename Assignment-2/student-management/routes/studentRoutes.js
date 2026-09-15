const express = require("express");
const router = express.Router();

let students = require("../data/student");

router.get("/", (req, res) => {
    res.status(200).json(students);
});

router.get("/:id", (req, res) => {
    let id = Number(req.params.id);
    let student = students.find(s => s.id == id);

    if (!student)
        return res.status(404).json({ message: "Student not found" });

    res.status(200).json(student);
});

router.post("/", (req, res) => {
    let { name, age, course } = req.body;

    if (!name || !age || !course)
        return res.status(400).json({ message: "All fields are required" });

    let student = {
        id: students.length + 1,
        name: name,
        age: age,
        course: course
    };

    students.push(student);

    res.status(201).json(student);
});

router.put("/:id", (req, res) => {
    let id = Number(req.params.id);
    let student = students.find(s => s.id == id);

    if (!student)
        return res.status(404).json({ message: "Student not found" });

    student.name = req.body.name || student.name;
    student.age = req.body.age || student.age;
    student.course = req.body.course || student.course;

    res.status(200).json(student);
});

router.delete("/:id", (req, res) => {
    let id = Number(req.params.id);
    let index = students.findIndex(s => s.id == id);

    if (index == -1)
        return res.status(404).json({ message: "Student not found" });

    students.splice(index, 1);

    res.status(200).json({ message: "Student deleted" });
});

module.exports = router;