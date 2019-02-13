import React from 'react';
import { shallow } from 'enzyme';

import Navigation from './index';
import Search from './Search';

describe("Test navigation component", () => {
    it("test if Search component is blurred by default", () => {
        const element = shallow(
            <Search />
        );

        expect( element.state().inFocus ).toBe(false);
    });
})