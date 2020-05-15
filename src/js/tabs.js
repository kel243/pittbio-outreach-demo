export const openTab = event => {
  // Declare all variables
  let i, tabcontent, tablinks;
  const tabName = event.target.id;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName('user-page__tab-content');
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = 'none';
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName('user-page__tabs-links');
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(
      ' user-page__tabs-links--active',
      ''
    );
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(`${tabName}-tab`).style.display = 'block';
  event.currentTarget.className += ' user-page__tabs-links--active';
};
