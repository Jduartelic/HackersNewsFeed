<div style="text-align: center;">
 <h1>HackersNewsFeed</h1>
</div>

<!-- TABLE OF CONTENTS -->
<details>
 <summary>Table of Contents</summary>
 <ol>
   <li>
     <a href="#about-the-project">About The Project</a>
   </li>
   <li>
     <a href="#built-with">Built With</a>
   </li>
   <li>
     <a href="#getting-started">Getting Started</a>
     <ul>
       <li><a href="#prerequisites">Prerequisites</a></li>
       <li><a href="#installation">Installation</a></li>
     </ul>
   </li>
 </ol>
</details>

## About The Project

HackersNewsFeed was designed to deliver a seamless news feed experience with offline access. Users can view articles downloaded during the last session when offline, ensuring continuous access to information. Articles are displayed in a scrollable view, sorted by date, and can be opened in an in-app web view for easy reading.

The app includes intuitive swipe-to-delete functionality, allowing users to remove articles from the list, and ensuring deleted articles do not reappear upon data refresh. A dedicated favorites feature enables users to mark and access their favorite articles from a separate screen. Additionally, users can access a deleted articles view to see and manage previously removed content..

## Built With

The main technologies used are:

- ![React Native](https://img.shields.io/badge/react_native-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
- ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
- ![Yarn](https://img.shields.io/badge/yarn-%232C8EBB.svg?style=for-the-badge&logo=yarn&logoColor=white)

## Getting Started

This setup section is the core where you'll find all the necessary information to start your work environment.
Here, we detail the critical steps for installation and implementation, including specific procedures to have your
iOS and Android environments functional and other essential components. You will also find all the tools and resources
needed to correctly set up your work environment, enabling you to contribute efficiently to the project from the beginning.

### Prerequisites

To get your environment ready we recommend you to read [this documentation](https://reactnative.dev/docs/set-up-your-environment),
where you will find detailed information on basic installation requirements.

### Installation

After you have fulfilled all the installation **prerequisites** you need, you must follow these instructions to run the project locally:

1. Clone the repository <br>`git clone git@github.com:Jduartelic/HackersNewsFeed.git`
2. run test with <br>`yarn ci:test`
3. Install dependencies in the root of the project <br>`yarn`, if you're using iOS you should install pods <br>`cd ios && pod install`
4. Run the project <br>`yarn android` or `yarn ios`
5. Run the project in release mode <br>`yarn android --mode release`
