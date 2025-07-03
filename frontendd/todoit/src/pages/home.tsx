import { useEffect, useState } from "react";
import api from "../../api";


    interface Note {
      id: number;
      title: string;
      content: string;
    }

    function Home() {
      const [notes, setNotes] = useState<Note[]>([]);
      const [content, setContent] = useState<string>("");
      const [title, setTitle] = useState<string>("");

      useEffect(() => {
        getNote();
      }, []);

      const getNote = () => {
        api
          .get("api/notes/")
          .then((res) => res.data)
          .then((data: Note[]) => {
            setNotes(data);
            console.log(data);
          })
          .catch((err) => alert(err));
      };
      
      const deleteNote = async (id: number) => {
        api
          .delete(`/api/notes/delete/${id}/`)
          .then((res) => {
            if (res.status === 204) alert("Note Deleted");
            else alert("Failed to delete note");
          })
          .catch((error) => alert(error));
        getNote();
      };
      
      const createNote = async (e: React.FormEvent) => {
        e.preventDefault();
        api
          .post("api/notes/", { content, title })
          .then((res) => {
            if (res.status === 201) {
              alert("Note Created!");
              setTitle("");
              setContent("");
              getNote();
            }
            else alert("Failed to make notes");
          })
          .catch((err) => alert(err));
      };
      
      return (
        <div className="home-container">
          <div>
            <h2>Your Notes</h2>
            <div className="notes-list">
              {notes.length > 0 ? (
                notes.map((note) => (
                  <div key={note.id} className="note-card">
                    <h3>{note.title}</h3>
                    <p>{note.content}</p>
                    <button onClick={() => deleteNote(note.id)}>Delete</button>
                  </div>
                ))
              ) : (
                <p>No notes found. Create one below!</p>
              )}
            </div>
          </div>

          <h2>Create a Note</h2>
          <form onSubmit={createNote} className="note-form">
            <label htmlFor="title">Title:</label>
            <br />
            <input
              type="text"
              id="title"
              name="title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <label htmlFor="content">Content:</label>
            <br />
            <textarea
              name="content"
              id="content"
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <br />
            <input type="submit" value="Create Note" />
          </form>
        </div>
      );
    }

   
  

export default Home;