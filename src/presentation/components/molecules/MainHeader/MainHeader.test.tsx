import React from 'react';
import {fireEvent, render} from '@testing-library/react-native';
import ProductCard from './MainHeader';
import {ThemeProvider} from '@digitaltitransversal/tr_superapp_theme_v7';
import {mockThemeJSON} from '../../../../../jest/setup';

const onPressMock = jest.fn();

const ProductCardMock = () => {
  return render(
    <ThemeProvider theme={mockThemeJSON}>
      <ProductCard
        id={123}
        description={[
          {
            type: 'paragraph',
            text: 'test',
            spans: [],
          },
        ]}
        name="name"
        lifespan="lifespan"
        title="title"
        subtitle="subtitle"
        onPress={onPressMock}
        hasFacebook={true}
        hasInstagram={true}
        hasMessenger={true}
        hasTikTok={true}
        hasWhatsapp={true}
        hasX={true}
        status="active"
        width={100}
      />
    </ThemeProvider>,
  );
};

describe('ProductCard', () => {
  it('renders correctly', () => {
    const {getByTestId} = ProductCardMock();
    const productCardElement = getByTestId('product-card');

    expect(productCardElement).toBeDefined();
  });

  it('calls onPress function when productCard is pressed', () => {
    const {getByTestId} = ProductCardMock();
    const productCardElement = getByTestId('product-123');

    fireEvent.press(productCardElement);

    expect(onPressMock).toHaveBeenCalledTimes(1);
  });
});
