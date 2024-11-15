"use client";

import React from "react";

export default function MeaningContainer({ meaning }) {
  return (
    <div className="">
      <div className="font-semibold text-lg text-slate-600">
        {meaning.partOfSpeech}
      </div>
      {meaning.definitions.map((def, i) => (
        <div key={i} className="">
          <div className="text-2xl font-thin font-serif">
            {def.example && <>"{def.example}"</>}
          </div>
          <div className="flex items-center gap-3 hover:bg-slate-50 p-2 rounded-xl">
            <div className="font-extrathin bg-slate-300 p-1 rounded-sm">
              Def.
            </div>{" "}
            <span className="text-lg  text-slate-600">
              {def.definition && <>{def.definition}</>}
            </span>
          </div>
        </div>
      ))}{" "}
      <div className="mt-3">
        {meaning.antonyms.length > 0 && (
          <div>
            <div className="text-slate-500">Antonyms:</div>
            <div className="flex gap-5">
              {meaning.antonyms.map((obj, i) => (
                <span key={i}>{obj}</span>
              ))}
            </div>
          </div>
        )}
        {meaning.synonyms.length > 0 && (
          <div>
            <div className="text-slate-500">Synonyms:</div>
            <div className="flex gap-5">
              {meaning.synonyms.map((obj, i) => (
                <span key={i}>{obj}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
