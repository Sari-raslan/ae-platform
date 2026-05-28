const styles = [
  {
    id:"oriental-pop",
    name:"Oriental Pop",
    bpm:120,
    mood:"Epic"
  },
  {
    id:"khaleeji",
    name:"Khaleeji Groove",
    bpm:108,
    mood:"Live"
  },
  {
    id:"turkish",
    name:"Turkish Dance",
    bpm:132,
    mood:"Performance"
  }
];

function getStyles(){
  return {
    ok:true,
    count:styles.length,
    styles
  };
}

module.exports = {
  getStyles
};
