"use client";

export default function CategoryName({ id, name }: { id: string, name: string }) {
    const categoryNameSpanID = `categoryNameSpanID_${id}`;
    const categoryNameEditFormID = `categoryNameEditFormID_${id}`;
    const editButtonID = `editButtonID_${id}`;
    const cancelButtonID = `cancelButtonID_${id}`;
    const deleteButtonID = `deleteButtonID_${id}`;

    const handleEditButtonClick = () => {
        console.log("Enetered editButtonClicked : ID:", categoryNameSpanID);
        if (!document.getElementById(categoryNameEditFormID)?.classList.contains("hidden")) {
            document.getElementById(categoryNameSpanID)?.classList.add("hidden");
        }
        if (document.getElementById(categoryNameEditFormID)?.classList.contains("hidden")) {
            document.getElementById(categoryNameEditFormID)?.classList.remove("hidden");
        }
        document.getElementById(editButtonID)?.classList.add("hidden");
        document.getElementById(deleteButtonID)?.classList.add("hidden");
    }

    const handleCancelButtonClick = () => {
        console.log("Enetered editButtonClicked : ID:", categoryNameSpanID);
        let categoryNameSpan = document.getElementById(categoryNameSpanID);
        if (categoryNameSpan != null && categoryNameSpan.classList.contains("hidden")) {
            categoryNameSpan.classList.remove("hidden");
        }

        let categoryNameEditForm = document.getElementById(categoryNameEditFormID);
        if (categoryNameEditForm != null && !categoryNameEditForm.classList.contains("hidden")) {
            categoryNameEditForm.classList.add("hidden");
        }
        document.getElementById(editButtonID)?.classList.remove("hidden");
        document.getElementById(deleteButtonID)?.classList.remove("hidden");
    }

    const handleDeleteButtonClick = () => {
        console.log("Enetered deleteButtonClicked");
    }

    return (
        <>
            <span id={`categoryNameSpanID_${id}`}>
                {name}
            </span>

            <form id={`categoryNameEditFormID_${id}`} className="hidden ml-3">

                <label className="text-gray-700" htmlFor="categoryNameInput">Name</label>
                <input id="categoryNameInput" className="ml-2 p-1 border" type="text" placeholder="Insert new category name" defaultValue={name} />

                <button onClick={handleCancelButtonClick} className="h-8 px-4 m-2 text-sm text-indigo-100 transition-colors duration-150 bg-gray-500 rounded-lg focus:shadow-outline hover:bg-gray-400">Cancel</button>

                <button type="submit" className="h-8 px-4 m-2 text-sm text-indigo-100 transition-colors duration-150 bg-blue-600 rounded-lg focus:shadow-outline hover:bg-indigo-800">Submit</button>

            </form>

            <button
                id={editButtonID}
                type="button"
                className="inline-flex items-center p-1 ms-2 text-sm text-white bg-transparent rounded-sm hover:bg-gray-200 hover:text-black dark:hover:bg-gray-100 dark:hover:text-white ml-1"
                aria-label="Remove"
                onClick={handleEditButtonClick}>
                <svg className="h-4 w-4 text-yellow-500" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" strokeLinecap="round" strokeLinejoin="round">  <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" /></svg>
                <span className="sr-only">Edit</span>
            </button>

            <button
                id={deleteButtonID}
                type="button"
                className="inline-flex items-center p-1 ms-2 text-sm text-white bg-transparent rounded-sm hover:bg-gray-200 hover:text-black dark:hover:bg-gray-100 dark:hover:text-white ml-1"
                aria-label="Remove"
                onClick={handleDeleteButtonClick}>
                <svg className="h-4 w-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>

                <span className="sr-only">Delete</span>
            </button>
        </>
    );
}