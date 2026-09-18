import { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { addDoc, collection, deleteDoc, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "./config/firebase";
import { FaEdit, FaMoon, FaSun, FaTrash } from "react-icons/fa";

const emptyForm = {
  name: "",
  instructor: "",
  category: "",
  duration: "",
  status: "Active",
};

const App = () => {
  const [courses, setCourses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [loding, setLoding] = useState(true);
  const [isEdiet, setIsEdiet] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  useEffect((() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === "light" ? "dark" : "light");
    root.classList.add(theme);
    localStorage.setItem("theme", theme)

  }), [theme])

  const [selectedCourse, setSelectedCourse] = useState(null);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const getRecords = async () => {
    try {
      const data = await getDocs(collection(db, "courses"));

      let receivedCourses = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }))

      setCourses(receivedCourses);
      console.log(receivedCourses);

    }
    catch (err) {
      console.log(err);
    }
    finally {
      setLoding(false);
    }

  }

  useEffect(() => {
    getRecords();
  }, [])

  const handleAdd = async (event) => {
    event.preventDefault();
    await addDoc(collection(db, "courses"), form);
    setForm(emptyForm);
    setIsModalOpen(false);
    getRecords();
    toast.success("Course added successfully");
  };

  const handleEdit = async (event) => {
    event.preventDefault();

    try {
      await updateDoc(doc(db, "courses", selectedCourse.id), {
        // ممكن تنعمل بطريقة افضبل بحيث نلف على الفورم ونعطي مل حقل .اسموا الفورم .اقيمتوا
        name: form.name,
        instructor: form.instructor,
        category: form.category,
        duration: form.duration,
        status: form.status,
      });

      toast.success("Course updated successfully");

      setForm(emptyForm);
      setSelectedCourse(null);
      setIsEdiet(false);
      setIsModalOpen(false);

      getRecords();
    } catch (err) {
      console.log(err);
      toast.error("Failed to update course");
    }
  };

  const handleDelete = async (id) => {
    try {

      await deleteDoc(doc(db, "courses", id));
      getRecords();


    } catch (err) {
      console.log("DELETE ERROR:", err);
      toast.error("Failed to delete course");
    }
    finally {
      toast.success("Course deleted successfully");

    }
  };


  return (
    <>
      <Toaster />

      <main className="min-h-screen bg-slate-50 p-4 sm:p-8 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl">

          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-indigo-600">
                Learning management
              </p>

              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                All Courses
              </h1>

              <p className="mt-1 text-slate-500 dark:text-slate-400">
                Manage and organize your available courses.
              </p>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 dark:shadow-indigo-950/40 cursor-pointer"
            >
              <span className="text-xl leading-none">+</span>
              Add New Course
            </button>

            {/* قصة الدارك موووووووود */}

            <button
              className={`cursor-pointer
              duration-300 absolute bottom-7 right-10 z-5000
              ${theme === "dark" && "hidden"}`}
              onClick={() => setTheme("dark")}
            >
              <div className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-yellow-100 shadow-lg shadow-yellow-300/50 transition duration-300 hover:scale-105">
                <div className="absolute bottom-0 h-6 w-14 rounded-t-full bg-yellow-200/70"></div>

                <FaSun className="relative z-10 h-9 w-9 text-yellow-500 transition duration-300 hover:text-yellow-400" />
              </div>
            </button>

            <button
              className={`cursor-pointer
              duration-300 absolute bottom-7 right-10 z-5000
              ${theme === "light" && "hidden"}`}
              onClick={() => setTheme("light")}
            >
              <div className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-slate-800 shadow-lg shadow-black/40 transition duration-300 hover:scale-105">
                <div className="absolute bottom-0 h-6 w-14 rounded-t-full bg-slate-700"></div>

                <FaMoon className="relative z-10 h-8 w-8 text-slate-100 transition duration-300 hover:text-white" />
              </div>
            </button>

          </div>

          {loding ? (
            <p className="mb-7 text-center text-5xl font-bold text-slate-800 dark:text-slate-200">
              loging data ...
            </p>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">

              <div className="overflow-x-auto">

                <table className="w-full min-w-[800px] text-left">

                  <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">

                    <tr>

                      {[
                        "Course",
                        "Instructor",
                        "Category",
                        "Duration",
                        "Status",
                        "Action"
                      ].map((heading) => (
                        <th
                          key={heading}
                          className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                        >
                          {heading}
                        </th>
                      ))}

                    </tr>

                  </thead>

                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">

                    {courses.map((course) => (
                      <tr
                        key={course.id}
                        className="transition hover:bg-slate-50 dark:hover:bg-slate-800"
                      >

                        <td className="px-6 py-5">

                          <div className="flex items-center gap-3">

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 font-bold text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300">
                              {course.name.charAt(0)}
                            </div>

                            <span className="font-semibold text-slate-800 dark:text-slate-100">
                              {course.name}
                            </span>

                          </div>

                        </td>

                        <td className="px-6 py-5 text-slate-600 dark:text-slate-400">
                          {course.instructor}
                        </td>

                        <td className="px-6 py-5">

                          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                            {course.category}
                          </span>

                        </td>

                        <td className="px-6 py-5 text-slate-600 dark:text-slate-400">
                          {course.duration}
                        </td>

                        <td className="px-6 py-5">

                          <span
                            className={`rounded-full px-3 py-1 text-sm font-medium ${course.status === "Active"
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                              : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                              }`}
                          >
                            {course.status}
                          </span>

                        </td>

                        <td className="px-6 py-5">

                          <div className="flex gap-2">

                            <button
                              className="cursor-pointer rounded p-2 text-blue-500 transition duration-300 hover:text-blue-400"
                              title="Edit duration-300"
                              onClick={() => (
                                setSelectedCourse(course),
                                setForm(course),
                                setIsEdiet(true),
                                setIsModalOpen(true)
                              )}
                            >
                              <FaEdit />
                            </button>

                            <button
                              className="cursor-pointer rounded p-2 text-red-600 transition duration-300 hover:text-red-500"
                              title="Delete"
                              onClick={() => handleDelete(course.id)}
                            >
                              <FaTrash />
                            </button>

                          </div>

                        </td>

                      </tr>
                    ))}

                  </tbody>

                </table>

              </div>

            </div>

          )}

        </div>

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">

            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 dark:shadow-black/50">

              <div className="mb-6 flex items-start justify-between">

                <div>

                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white  ">
                    Add New Course
                  </h2>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Enter the course information below.
                  </p>

                </div>

              </div>

              {!isEdiet ? (

                <form onSubmit={handleAdd} className="space-y-4">

                  {
                    [
                      ["name", "Course Name", "e.g. Advanced JavaScript"],
                      ["instructor", "Instructor", "e.g. John Smith"],
                      ["category", "Category", "e.g. Development"],
                      ["duration", "Duration", "e.g. 8 Weeks"],
                    ].map(([name, label, placeholder]) => (

                      <div key={name}>

                        <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                          {label}
                        </label>

                        <input
                          required
                          name={name}
                          value={form[name]}
                          onChange={handleChange}
                          placeholder={placeholder}
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/20"
                        />

                      </div>

                    ))
                  }

                  <div>

                    <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Status
                    </label>

                    <select
                      name="status"
                      value={form.status}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-indigo-500 dark:focus:ring-indigo-500/20"
                    >
                      <option>Active</option>
                      <option>Draft</option>
                    </select>

                  </div>

                  <div className="flex justify-end gap-3 pt-3">

                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="rounded-xl px-5 py-3 font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700 cursor-pointer"
                    >
                      Add Course
                    </button>

                  </div>

                </form>

              )

                //edit
                :

                (

                  <form onSubmit={handleEdit} className="space-y-4">

                    {
                      [
                        ["name", "Course Name", "e.g. Advanced JavaScript"],
                        ["instructor", "Instructor", "e.g. John Smith"],
                        ["category", "Category", "e.g. Development"],
                        ["duration", "Duration", "e.g. 8 Weeks"],
                      ].map(([name, label, placeholder]) => (

                        <div key={name}>

                          <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                            {label}
                          </label>

                          <input
                            required
                            name={name}
                            value={form[name]}
                            onChange={handleChange}
                            placeholder={placeholder}
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/20"
                          />

                        </div>

                      ))
                    }

                    <div>

                      <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Status
                      </label>

                      <select
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-indigo-500 dark:focus:ring-indigo-500/20"
                      >
                        <option>Active</option>
                        <option>Draft</option>
                      </select>

                    </div>

                    <div className="flex justify-end gap-3 pt-3">

                      <button
                        type="button"
                        onClick={() => (setIsModalOpen(false), setIsEdiet(false))}
                        className="rounded-xl px-5 py-3 font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
                      >
                        Edit Course
                      </button>

                    </div>

                  </form>

                )}

              {/* end edit */}

            </div>

          </div>
        )}

      </main>
    </>
  );
};

export default App;