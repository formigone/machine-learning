const React = require('react');

const Person = function(props) {
  return (
    <ul className="my-list">
      <li><strong>Name: </strong> {props.name}</li>
      <li><strong>Age: </strong> {props.age}</li>

      {props.twig && (<twig>if faves</twig>)}
      {props.faves && (
        <li><strong>Favorites: </strong>
          <ul className="my-list--sub">
            {props.twig && (<twig>for fave in faves</twig>)}
            {props.faves.map((fave) => (
              <li key={`fave/${fave.key}`}>
                <strong>{fave.key}: </strong> {fave.value}
              </li>
            ))}
            {props.twig && (<twig>endfor</twig>)}
          </ul>
        </li>
      )}
      {props.twig && (<twig>endif</twig>)}
    </ul>
  );
};

module.exports = Person;
