"use client";

import { deleteProblemCategory } from "@/app/lib/data/problem-categories/mutations/deleteProblemCategory";

export default function DeleteProblemCategory({ id }: { id: string }) {
    const trigerDelete = async function () {
        await deleteProblemCategory(id);
    };

    return (
        <span>
            <button data-tooltip-target="tooltip-dark" data-tooltip-placement="top" className="border border-transparent bg-transparent text-blue-700 hover:text-blue-900 ml-2"
                onDoubleClick={trigerDelete}>
                <svg className="h-4 w-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </button>
        </span>
    );
}