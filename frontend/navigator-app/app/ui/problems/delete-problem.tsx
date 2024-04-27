"use client";

import { deleteProblem } from "@/app/lib/data/problems/mutations/deleteProblemAction";

export default function DeleteComponent({ id }: { id: string } ) {
    const trigerDelete = async function() {
        await deleteProblem(id);
    };

    return (
        <>
            <button data-tooltip-target="tooltip-dark" data-tooltip-placement="top" className="border border-transparent bg-transparent text-blue-700 hover:text-blue-900"
            onDoubleClick={trigerDelete}>Delete</button>
        </>
    );
}