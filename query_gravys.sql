
-----------------------------------------------
-- full view
-----------------------------------------------


create (p:Person {name: 'John Doe',age: 23})
 

match (p:Person {name: 'John Doe'})
return p.name as name, p.age as age
    
-- https://stackoverflow.com/questions/12903873/neo4j-get-all-nodes-in-a-graph-even-those-that-are-unconnected-by-relationship
match (p:Person)
return p
    
-----------------------------------------------
-- end script
-----------------------------------------------