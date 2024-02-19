"use client";

import React, { useRef } from "react";
import { createFolder } from "./createFolder";

export default function FolderForm() {
  const ref = useRef<HTMLFormElement>(null);

  return (
    <form
      className="mb-4 w-52 flex gap-x-2 items-center"
      ref={ref}
      action={(formData) => {
        createFolder(formData);
        ref.current?.reset();
      }}
    >
      <div className="grow">
        <label className="text-gray-300 text-sm font-bold mb-2 hidden" htmlFor="name" aria-label="New Folder">
          New Name
        </label>
        <input className="input input-bordered" name="name" id="name" type="text" placeholder="my folder" />
      </div>
      <button className="btn btn-primary">Submit</button>
    </form>
  );
}
