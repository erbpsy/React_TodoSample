import React, { useEffect } from 'react'
const Accordion = (props) => {
    const { todo, GetTodoList }=props;
    const [isOpen, setOpen] = React.useState(false);
    const [subTaskValue, setSubTaskValue] = React.useState('');
    const [todoId, setTodoId] = React.useState(0);

    // hooks use to set state value on load component
    useEffect(() => { setTodoId(todo.todoid) }, []);

    // add subtask item
    const AddSubtask = async (e) => {

        // prevent from reloading page
        e.preventDefault();

        try {
            const body = { title: subTaskValue, todoid: todoId, status: 'completed' };
            const response = await fetch('/subtasks', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            })
            console.log(response);
        } catch (err) {
            console.log(err.message);
        }

        // set subtask value back to empty
        setSubTaskValue('');

        // get todo list items to show newly added item on ui
        GetTodoList();
    }

    return (
        <div className="accordion-wrapper">
            <div className={`accordion-title ${isOpen ? "open" : ""}`}
                onClick={() => setOpen(!isOpen)}>
                <input readOnly id='chkAccordian' type='checkbox' checked={todo.status === 'completed'}></input>
                {todo.title}
            </div>
            <div className={`accordion-item ${!isOpen ? "collapsed" : ""}`}>
                <ul>
                    {todo.subtasks.map((subtask, index) => (
                        <li key={index} className="accordion-content list-group-item list-group-item">
                            <input readOnly id='chkAccordian' type='checkbox' checked={subtask.status === 'completed'}></input>{subtask.title}
                        </li>
                    ))}
                    <form className='d-flex' onSubmit={AddSubtask}>
                        <input placeholder='What are the steps ?' value={subTaskValue}
                            onChange={(e) => setSubTaskValue(e.target.value)} id="txtsteps" type='text'></input>
                        <button id="btnAddNewStep">New Step</button>
                    </form>
                </ul>
            </div>
        </div>
    );
};

export default Accordion;