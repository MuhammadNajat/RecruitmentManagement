"use client";

export default function DeleteUserInput({ id }: { id: string } ) {
    const showDeletePopup =  function() {
        const popup = document.getElementById('popup');
        if(popup == null) {
            return;
        }
        popup.classList.remove('hidden');
    };

    const hideDeletePopup =  function() {
        const popup = document.getElementById('popup');
        if(popup == null) {
            return;
        }
        popup.classList.add('hidden');
    };

    const confirmDelete = async function() {
        //"use server";
        const popup = document.getElementById('popup');
        if(popup == null) {
            return;
        }
        popup.classList.add('hidden');
    };

    return (
        <>
            <button className="border border-transparent bg-transparent text-blue-700 hover:text-blue-900" onClick={showDeletePopup}>Delete</button>
    
            <div id="popup" className="hidden fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-lg mx-7 my-8">
                <p className="text-left mb-10">Delete the user?</p>
                <button id="confirmButton" className="mr-10 bg-red-200 text-gray-900 px-6 py-2 rounded-lg hover:bg-red-600 hover:text-white" onClick={confirmDelete}>Delete</button>
                <button id="closeButton" className="ml-8 bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-gray-600" onClick={hideDeletePopup}>Close</button>
            </div>
            </div>
        </>
    );
}