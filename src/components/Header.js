import React from 'react';
import { FaGithub } from 'react-icons/fa';

import Container from 'components/Container';

const Header = () => {
	return (
		<header>
			<Container type="content">
				<h1>
					<a href="/">Coronavirus(COVID-19) Map</a>
				</h1>
				<ul>
					<li>
						<a href="https://github.com/antoniojhun/Covid19Map.git">
							<FaGithub /> Github
						</a>
					</li>
				</ul>
			</Container>
		</header>
	);
};

export default Header;
