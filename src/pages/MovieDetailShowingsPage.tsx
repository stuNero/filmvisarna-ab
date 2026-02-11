MovieDetailShowingsPage.route = {
  path: '/moviedetailshowings',
  menuLabel: 'Movie Details And Showings',
  index: 2
};

export default function MovieDetailShowingsPage() {
  return <>
    <div>
      <h2>Detta är Film Detalj -och visnings sidan</h2>
      <p>Den innehåller information om den valda filmen och när den visas</p>
    </div>
  </>;
}