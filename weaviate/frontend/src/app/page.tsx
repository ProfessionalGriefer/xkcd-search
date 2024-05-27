'use client';
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


import React, { useState, useCallback } from 'react';

import weaviate from 'weaviate-client';

const client = weaviate.client({
  scheme: 'http',
  host: 'localhost:8080',
});

function App() {
  const [results, setResults] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [showMore, setShowMore] = useState(false);

  const onChange = (event: React.FormEvent<HTMLInputElement>) => {
    setSearchTerm(event.currentTarget.value);
  };

  const fetch = useCallback(() => {
    async function fetch() {
      const res = await client.graphql
        .get()
        .withClassName('MultiModal')
        .withNearText({ concepts: [searchTerm] })
        .withFields('filename image _additional{ certainty id }')
        .do();
      setResults(res);
    }

    fetch();
  }, [searchTerm]);

  const onSubmit = event => {
    setShowMore(false)
    fetch();
    event.preventDefault();
  };

  const getResults = results => {
    const head = results['data']['Get']['MultiModal'][0]
    return <div>
      <div>
        <img
          style={{ maxHeight: '400px' }}
          alt="Certainty: "
          src={
            'data:image/jpg;base64,' +
            head['image']
          }
        />
        <div >Certainty: {(head['_additional']['certainty'] * 100).toFixed(2)} %</div>
      </div>
    </div>
  }

  const getRestResults = (results) => {
    const [, ...rest] = results['data']['Get']['MultiModal']
    return <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', paddingTop: "20px" }}>
      {
        rest.map(obj => {
          return (
            <div key={obj['_additional']['id']}>
              <img
                style={{ maxHeight: '200px' }}
                alt="Certainty: "
                src={
                  'data:image/jpg;base64,' +
                  obj['image']
                }
              />
              <div >Certainty: {(obj['_additional']['certainty'] * 100).toFixed(2)} %</div>
            </div>
          )
        })
      }
    </div>
  }

  return (
    <div className="container pt-8" >
      <h1 className="text-3xl font-bold">
        XKCD Comic Search
      </h1>
      <form
        onSubmit={onSubmit}
      >
        <div className="flex flex-row my-4">
          <Input
            className="mr-4"
            type="text"
            placeholder="Search for images"
            onChange={onChange}
          />
          <Button
            type="submit"
            value="Search"
            style={{ backgroundColor: '#fa0171' }}
          >Search</Button>
        </div>
      </form>
      {results.data && getResults(results)}
      {results.data &&
        <div className="control" style={{ paddingTop: "20px" }}>
          <Button
            type="button"
            onClick={() => setShowMore(!showMore)}
            style={{ backgroundColor: '#fa0171' }}
          >
            {showMore ? "Show less" : "Show more"}
          </Button>
        </div>}
      {results.data && showMore && getRestResults(results)}
      <div style={{ height: '50px' }} />
    </div>
  );
}
export default App;
